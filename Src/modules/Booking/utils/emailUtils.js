import nodemailer from "nodemailer";

export const sendBookingStatusEmail = async (userId, status, token = null, reason = null) => {
  // Normally, you'd fetch the user's email using userId from your user model
  const userEmail = await getUserEmail(userId);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let subject = "";
  let message = "";

  switch (status) {
    case "approved":
      subject = "Your Table Booking is Confirmed ✅";
      message = `Your table has been approved! Your booking token is: ${token}`;
      break;
    case "rejected":
      subject = "Your Table Booking was Rejected ❌";
      message = `Unfortunately, your booking has been rejected by the restaurant.`;
      break;
    case "cancelled":
      subject = "Your Table Booking was Cancelled ⚠️";
      message = `Your booking has been cancelled. Reason: ${reason || "No reason provided."}`;
      break;
    default:
      subject = "Booking Update";
      message = "There’s an update on your table booking.";
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject,
    text: message,
  });
};

// Mock function (replace with your actual user model)
const getUserEmail = async (userId) => {
  // Example: const user = await UserModel.findById(userId);
  // return user.email;
  return "customer@example.com";
};
