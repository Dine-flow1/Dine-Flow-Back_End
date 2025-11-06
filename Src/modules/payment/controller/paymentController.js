import paymentService from "../service/paymentService.js";

export const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount,restaurantId } = req.body;
    console.log(orderId)
    console.log(amount)
    console.log('hfcue')
    const user = req.user;
    console.log('here')
    console.log(user)
    if (!orderId || !amount) {
      return res.status(400).json({ message: "Missing orderId or amount" });
    }

    const paymentData = await paymentService.initiatePayment(orderId, user, amount,restaurantId);
    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: paymentData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const payment = await paymentService.verifyPayment(req.body);
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const payment = await paymentService.refundPayment(req.params.id);
    res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
