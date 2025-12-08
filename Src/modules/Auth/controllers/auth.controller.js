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
export const verifyOtp = async (req, res) => {
  try {
    const result = await authService.verifyOtp(req.body);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.log("OTP Verify Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body);

    // Convert JWT_EXPIRES to milliseconds for cookie maxAge
    const jwtExpires = process.env.JWT_EXPIRES || "7d"; // default 7 days
    let maxAge = 7 * 24 * 60 * 60 * 1000; // default 7 days in ms

    if (jwtExpires.endsWith("d")) {
      maxAge = parseInt(jwtExpires) * 24 * 60 * 60 * 1000;
    } else if (jwtExpires.endsWith("h")) {
      maxAge = parseInt(jwtExpires) * 60 * 60 * 1000;
    } else if (jwtExpires.endsWith("m")) {
      maxAge = parseInt(jwtExpires) * 60 * 1000;
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge, // ✅ use the JWT_EXPIRES duration
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
