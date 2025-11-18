import TableBookingModel from "../modules/tableBookingSchema.js";
import { sendBookingStatusEmail } from "../utils/emailUtils.js";

const tableBookingService = {
createTable: async (restaurantId, data) => {
  const existingTable = await TableBookingModel.findOne({
    restaurantId,
    tableNumber: data.tableNumber,
  });

  if (existingTable) {
    throw new Error(`Table number ${data.tableNumber} already exists in this restaurant`);
  }

  const table = new TableBookingModel({ ...data, restaurantId });
  await table.save();
  return table;
},


  getTablesByRestaurant: async (restaurantId) => {
    return TableBookingModel.find({ restaurantId });
  },

  getTableById: async (restaurantId, tableId) => {
    return TableBookingModel.findOne({ _id: tableId, restaurantId });
  },

  updateTable: async (restaurantId, tableId, data) => {
    return TableBookingModel.findOneAndUpdate(
      { _id: tableId, restaurantId },
      data,
      { new: true }
    );
  },

  deleteTable: async (restaurantId, tableId) => {
    return TableBookingModel.findOneAndDelete({ _id: tableId, restaurantId });
  },

  updateTableStatus: async (restaurantId, tableId, status) => {
    return TableBookingModel.findOneAndUpdate(
      { _id: tableId, restaurantId },
      { status },
      { new: true }
    );
  },

  // ========== BOOKING FUNCTIONS ==========
createBooking: async (restaurantId, tableId, customerId, data) => {
    const table = tableId
    ? await TableBookingModel.findOne({ _id: tableId, restaurantId })
    : await tableBookingService.autoAssignTable(restaurantId, data.guests);
  if (!table) throw new Error("Table not found or unavailable");
  if (["reserved", "received"].includes(table.status)) {
    throw new Error(
      `This table is already ${table.status}. Please choose another table.`
    );
  }
  const booking = {
    customerId,
    type: tableId ? "specific" : "auto",
    date: data.date,
    time: data.time,
    totalAmount: data.totalAmount || 0,
    status: "pending",
  };

  table.bookings.push(booking);
  await table.save();
  return table.bookings[table.bookings.length - 1];
},

  autoAssignTable: async (restaurantId, guests) => {
    const tables = await TableBookingModel.find({
      restaurantId,
      seats: { $gte: guests },
      status: "available",
    }).sort({ seats: 1 });

    if (!tables.length) throw new Error("No available tables");
    return tables[0];
  },

  getTablesByRestaurantForCustomer: async (restaurantId) => {
  const tables = await TableBookingModel.find(
    { restaurantId },
    "tableNumber seats status"
  ).sort({ tableNumber: 1 }); 

  return tables;
},

  approveBooking: async (restaurantId, tableId, bookingId) => {
    const table = await TableBookingModel.findOne({
      _id: tableId,
      restaurantId,
    });
    if (!table) throw new Error("Table not found");

    const booking = table.bookings.id(bookingId);
    if (!booking) throw new Error("Booking not found");

    booking.status = "approved";
    booking.token = Math.random().toString(36).substring(2, 9).toUpperCase();
    table.status = "reserved";
    await table.save();
    await sendBookingStatusEmail(booking.customerId, "approved", booking.token);
    return booking;
  },

  rejectBooking: async (restaurantId, tableId, bookingId) => {
    const table = await TableBookingModel.findOne({
      _id: tableId,
      restaurantId,
    });
    if (!table) throw new Error("Table not found");

    const booking = table.bookings.id(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "approved") {
      throw new Error("Cannot reject an already approved booking");
    }
    if (booking.status === "cancelled") {
      throw new Error("Cannot reject a cancelled booking");
    }
    if (booking.status !== "pending") {
      throw new Error("Only pending bookings can be rejected");
    }

    booking.status = "rejected";
    table.status = "available";
    await table.save();

    await sendBookingStatusEmail(booking.customerId, "rejected");

    return booking;
  },

  cancelBooking: async (customerId, tableId, bookingId, reason) => {
    const table = await TableBookingModel.findOne({
      _id: tableId,
      "bookings.customerId": customerId,
    });
    if (!table) throw new Error("Booking not found for this customer");

    const booking = table.bookings.id(bookingId);
    if (!booking) throw new Error("Booking not found");

    booking.status = "cancelled";
    booking.cancellationReason = reason;

    // Free up table again
    table.status = "available";
    await table.save();
    await sendBookingStatusEmail(customerId, "cancelled", null, reason);

    return booking;
  },

  getBookingsByRestaurant: async (restaurantId) => {
    return TableBookingModel.find({ restaurantId });
  },

  getBookingsByCustomer: async (customerId) => {
    return TableBookingModel.find({ "bookings.customerId": customerId });
  },
};

export default tableBookingService;
