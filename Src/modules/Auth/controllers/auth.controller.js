import authService from "../services/auth.services.js";

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.log("authregisterErrorin ctlr", error);

    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body);
    console.log("controler",token);
    console.log("controler",user);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
       maxAge: 15 * 60 * 1000,
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
export const logout = async (req, res) => {
  try {
    const result = await authService.logout();
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.log("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed, please try again",
    });
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
