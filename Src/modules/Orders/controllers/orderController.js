import Restaurant from "../../Restaurant/models/restaurantmodel.js";
import orderServices from "../services/orderServices.js";

const orderController = {
  createOrder: async (req, res) => {
     const customerId = req.user.id; 
    const result = await orderServices.createOrder(customerId, req.body);
    res.status(result.status).json(result);
  },

  cancelOrder: async (req, res) => {
    const customerId = req.user.id;
    const { orderId } = req.params;
    const result = await orderServices.cancelOrder(orderId, customerId);
    res.status(result.status).json(result);
  },

  getCurrentOrder: async (req, res) => {
    const result = await orderServices.getCurrentOrder(req.user.id);
    res.status(result.status).json(result);
  },

  getMyOrders: async (req, res) => {
    const result = await orderServices.getCustomerOrders(req.user.id);
    res.status(result.status).json(result);
  },

  getMyOrderById: async (req, res) => {
    const { orderId } = req.params;
    const result = await orderServices.getOrderById(orderId, req.user.id);
    res.status(result.status).json(result);
  },

  getOrdersByRestaurant: async (req, res) => {
      const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) return res.status(404).json({ status: 404, message: "Restaurant not found" });

    const result = await orderServices.getOrdersByRestaurant(restaurant._id);
    res.status(result.status).json(result);
  },

  updateOrderStatus: async (req, res) => {
    const restaurantId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(restaurantId);
    console.log(orderId);
    console.log(status);
    
    const result = await orderServices.updateOrderStatus(
      orderId,
      restaurantId,
      status
    );
    res.status(result.status).json(result);
  },

  getOrdersByCustomerId: async (req, res) => {
    const restaurantId = req.user.id;
    const { customerId } = req.params;
    console.log(restaurantId);
    console.log(customerId);
    
    const result = await orderServices.getOrdersByCustomerId(
      restaurantId,
      customerId
    );
    res.status(result.status).json(result);
  },
  assignDelivery: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { deliveryPersonId } = req.body;
      const result = await orderServices.assignDelivery(
        orderId,
        deliveryPersonId
      );
      return res.status(result.status).json(result);
    } catch (error) {
      console.log("AssignDeliveryController Error:", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  },

  generateInvoice: async (req, res) => {
    try {
      const { orderId } = req.params;
      const result = await orderServices.generateInvoice(orderId);
      return res.status(result.status).json(result);
    } catch (error) {
      console.log("GenerateInvoiceController Error:", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  },
};

export default orderController;
