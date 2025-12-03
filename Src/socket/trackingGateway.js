import { Server } from "socket.io";


let io = null;
export const initTrackingSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },

  });

  console.log("🚀 Tracking Socket Running...");

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join customer to their own room
    socket.on("join_room", (orderId) => {
      socket.join(orderId);
      console.log(`User joined room: ${orderId}`);
    });
  });
};

export const sendOrderUpdate = (orderId, data) => {
  if (io) {
    io.to(orderId).emit("order_update", data);
  }
};
