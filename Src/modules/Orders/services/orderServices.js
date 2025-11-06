import mongoose, { get } from "mongoose";
import OrderModel from "../models/orderModels.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import Restaurant from "../../Restaurant/models/restaurantmodel.js";

const orderServices = {
  createOrder: async (customerId, data) => {
    try {
      const {
        restaurantId,
        items,
        orderType,
        totalAmount,
        deliveryDetails,
        paymentMethod,
        notes,
        customerName,
        customerPhone,
      } = data;
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) return { status: 404, message: "Restaurant not found" };

      // Build order
      const newOrder = new OrderModel({
        customer: {
          customerId,
          name: customerName || "",
          phone: customerPhone || "",
        },
        restaurant: {
          restaurantId: restaurant._id,
          name: restaurant.restaurantName,
          address: restaurant.branches?.[0]?.address || "",
        },
        items: items.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice || item.price,
          totalPrice: item.totalPrice,
        })),
        orderSummary: {
          orderType,
          totalAmount,
          paymentMethod,
          notes: notes || "",
        },
        deliveryDetails: deliveryDetails || {},
        orderStatus: { placed: new Date() },
      });

      const savedOrder = await newOrder.save();
      return {
        status: 201,
        message: "Order placed successfully",
        data: savedOrder,
      };
    } catch (err) {
      console.log("CreateOrder Error:", err);
      return { status: 500, message: "Internal server error" };
    }
  },

  // ✅ 2. Cancel Order
  cancelOrder: async (orderId, customerId) => {
    try {
      const order = await OrderModel.findOne({ _id: orderId, customerId });
      if (!order) return { status: 404, message: "Order not found" };

      if (
        ["Accepted", "Out for Delivery", "Delivered"].includes(
          order.orderStatus
        )
      )
        return {
          status: 400,
          message: "Cannot cancel this order at this stage",
        };

      // Set order status to Cancelled
      order.orderStatus = "Cancelled";

      // Refund logic if order is paid
      if (order.paymentStatus === "Paid") {
        try {
          const refund = await PaymentGateway.refund(
            order.paymentId,
            order.totalAmount
          );

          order.refundStatus = "Refunded";
          order.refundAmount = refund.amount;
          order.refundId = refund.id;

          await order.save();
          return {
            status: 200,
            message: "Order cancelled and refund initiated successfully",
            data: order,
          };
        } catch (refundError) {
          return {
            status: 500,
            message: "Order cancelled, but refund failed",
            data: { order, error: refundError.message },
          };
        }
      }

      // If no payment / refund needed
      await order.save();
      return {
        status: 200,
        message: "Order cancelled successfully",
        data: order,
      };
    } catch (err) {
      console.log("CancelOrder Error:", err);
      return { status: 500, message: "Internal server error" };
    }
  },

  // ✅ 3. Get Current Active Order
  getCurrentOrder: async (customerId) => {
    try {
      const order = await OrderModel.findOne({
        customerId,
        orderStatus: { $in: ["Pending", "Accepted", "Out for Delivery"] },
      }).sort({ createdAt: -1 });
      return { status: 200, data: order || null };
    } catch (err) {
      console.log("GetCurrentOrder Error:", err);
      return { status: 500, message: "Internal server error" };
    }
  },
  // ✅ 4. Get All My Orders
  getCustomerOrders: async (customerId) => {
    try {
      const orders = await OrderModel.find({ customerId }).sort({
        createdAt: -1,
      });
      return { status: 200, data: orders };
    } catch (err) {
      console.log("GetCustomerOrders Error:", err);
      return { status: 500, message: "Internal server error" };
    }
  },

  // ✅ 5. Get Order by ID
  getOrderById: async (orderId, customerId) => {
    try {
      const order = await OrderModel.findOne({ _id: orderId, customerId });
      if (!order) return { status: 404, message: "Order not found" };
      return { status: 200, data: order };
    } catch (err) {
      console.log("GetOrderById Error:", err);
      return { status: 500, message: "Internal server error" };
    }
  },

  // ✅ 6. Restaurant Get All Orders
  getOrdersByRestaurant: async (restaurantId) => {
    // console.log(restaurantId)

    try {
      const orders = await OrderModel.find({ restaurantId }).sort({
        createdAt: -1,
      });
      return { status: 200, data: orders };
    } catch (err) {
      console.log("GetOrdersByRestaurant Error:", err);
      return { status: 500, message: "Internal server error" };
    }
  },
  // ✅ 7. Update Order Status
  updateOrderStatus: async (orderId, restaurantId, status) => {
    console.log(orderId);
    console.log(restaurantId);
    console.log(status);

    try {
      const order = await OrderModel.findOne({ _id: orderId });
      if (!order) return { status: 404, message: "Order not found" };

      order.orderStatus = status;

      if (status === "Accepted" && order.paymentStatus !== "Paid") {
        order.paymentStatus = "Paid";
      }

      await order.save();
      return { status: 200, message: `Order ${status}`, data: order };
    } catch (err) {
      console.log("UpdateOrderStatus Error:", err);
      return { status: 500, message: "Internal server error" };
    }
  },

  // ✅ 8. Get Orders by Customer ID (for restaurant view)
  getOrdersByCustomerId: async (restaurantId, customerId) => {
    try {
      const orders = await OrderModel.find({ customerId });
      return { status: 200, data: orders };
    } catch (err) {
      console.log("GetOrdersByCustomerId Error:", err);
      return { status: 500, message: "Internal server error" };
    }
  },

  assignDelivery: async (orderId, deliveryPersonId) => {
    try {
      const order = await OrderModel.findById(orderId);
      if (!order) return { status: 404, message: "Order not found" };

      order.deliveryDetails.deliveryPersonId = deliveryPersonId;
      await order.save();

      return { status: 200, message: "Delivery person assigned", data: order };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },
  generateInvoice: async (orderId) => {
    try {
      const order = await OrderModel.findById(orderId)
        .populate("customerId", "name email")
        .populate("restaurantId", "name address");

      if (!order) return { status: 404, message: "Order not found" };

      // Create invoices folder if not exists
      const invoicesDir = path.resolve("invoices");
      if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);

      // Set file path
      const invoicePath = path.join(invoicesDir, `invoice_${order._id}.pdf`);

      // Initialize PDF Document
      const doc = new PDFDocument({ margin: 50 });

      // Pipe to file
      const writeStream = fs.createWriteStream(invoicePath);
      doc.pipe(writeStream);

      // --- PDF Content ---
      doc.fontSize(20).text("INVOICE", { align: "center" }).moveDown(1);

      doc
        .fontSize(14)
        .text(`Restaurant: ${order.restaurantId.name}`)
        .text(`Address: ${order.restaurantId.address}`)
        .moveDown(1);

      doc
        .text(`Customer: ${order.customerId.name}`)
        .text(`Email: ${order.customerId.email}`)
        .moveDown(1);

      doc
        .text(`Order ID: ${order._id}`)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
        .moveDown(1);

      // Items Table
      doc.fontSize(16).text("Order Items:", { underline: true }).moveDown(0.5);

      order.items.forEach((item, index) => {
        doc
          .fontSize(12)
          .text(
            `${index + 1}. ${item.name} - ${item.quantity} x ₹${
              item.price
            } = ₹${item.quantity * item.price}`
          );
      });

      doc.moveDown(1);
      doc.fontSize(14).text(`Total: ₹${order.totalAmount}`, { bold: true });

      // Footer
      doc.moveDown(2);
      doc
        .fontSize(10)
        .text("Thank you for dining with us!", { align: "center" });

      // Finalize the PDF
      doc.end();

      // Wait for file to finish writing
      await new Promise((resolve) => writeStream.on("finish", resolve));

      return {
        status: 200,
        message: "Invoice generated successfully",
        data: { invoicePath },
      };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },
};

export default orderServices;
