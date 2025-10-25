import authService from "../services/auth.services";

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
  } catch (error) {
    console.log("registerError", error);

    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user },
    });
  } catch (error) {
    console.log("LoginError", error);
    res.status(401).json({ success: false, message: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res
      .status(200)
      .json({ success: true, message: "Reset email sent", data: result });
  } catch (error) {
    console.log("ForgetPasswordError", error);

    res.status(400).json({ success: false, message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const result = await authService.resetPassword(otp, newPassword);
    res
      .status(200)
      .json({ success: true, message: "Password updated", data: result });
  } catch (error) {
    console.log("ResetPasswordError", error);

    res.status(400).json({ success: false, message: error.message });
  }
};
