import tableBookingService from "../Services/tableService.js"

const tableBookingController = {
  // ========== TABLE CONTROLLERS ==========
  createTable: async (req, res) => {
    try {
      const restaurantId = req.user._id; 
      const date = req.body;
      const table = await tableBookingService.createTable(
        restaurantId,
        date
      );
      res.status(201).json({ success: true, data: table });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getTablesByRestaurant: async (req, res) => {
    try {
      const restaurantId = req.user._id;
      const tables = await tableBookingService.getTablesByRestaurant(
        restaurantId
      );
      res.json({ success: true, data: tables });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getTableById: async (req, res) => {
    try {
      const restaurantId = req.user._id;
      const table = await tableBookingService.getTableById(
        restaurantId,
        req.params.tableId
      );
      if (!table) return res.status(404).json({ message: "Table not found" });
      res.json({ success: true, data: table });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateTable: async (req, res) => {
    try {
      const restaurantId = req.user._id;
      const table = await tableBookingService.updateTable(
        restaurantId,
        req.params.tableId,
        req.body
      );
      res.json({ success: true, data: table });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteTable: async (req, res) => {
    try {
      const restaurantId = req.user._id;
      await tableBookingService.deleteTable(restaurantId, req.params.tableId);
      res.json({ success: true, message: "Table deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateTableStatus: async (req, res) => {
    try {
      const restaurantId = req.user._id;
      const { status } = req.body;
      const table = await tableBookingService.updateTableStatus(
        restaurantId,
        req.params.tableId,
        status
      );
      res.json({ success: true, data: table });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ========== BOOKING CONTROLLERS ==========
  createBooking: async (req, res) => {
    try {
      const { restaurantId, tableId } = req.params;
      const customerId = req.user._id;
      const booking = await tableBookingService.createBooking(
        restaurantId,
        tableId,
        customerId,
        req.body
      );
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getTablesByRestaurantForCustomer: async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const tables = await tableBookingService.getTablesByRestaurantForCustomer(restaurantId);

    if (!tables || tables.length === 0) {
      return res.status(404).json({ success: false, message: "No tables found for this restaurant." });
    }

    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
},

  approveBooking: async (req, res) => {
    try {
      const restaurantId = req.user._id;
      const { tableId, bookingId } = req.params;
      const booking = await tableBookingService.approveBooking(
        restaurantId,
        tableId,
        bookingId
      );
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  rejectBooking: async (req, res) => {
    try {
      const restaurantId = req.user._id;
      const { tableId, bookingId } = req.params;
      const booking = await tableBookingService.rejectBooking(
        restaurantId,
        tableId,
        bookingId
      );
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  cancelBooking: async (req, res) => {
    try {
      const customerId = req.user._id;
      const { tableId, bookingId } = req.params;
      const booking = await tableBookingService.cancelBooking(
        customerId,
        tableId,
        bookingId,
        req.body.reason
      );
      res.json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getBookingsByRestaurant: async (req, res) => {
    try {
      const restaurantId = req.user._id;
      const bookings = await tableBookingService.getBookingsByRestaurant(
        restaurantId
      );
      res.json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getBookingsByCustomer: async (req, res) => {
    try {
      const customerId = req.user._id;
      const bookings = await tableBookingService.getBookingsByCustomer(
        customerId
      );
      res.json({ success: true, data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default tableBookingController;
