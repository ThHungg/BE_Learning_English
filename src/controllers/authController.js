const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("req.body:", req.body);
    const regmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regmail.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "Err",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "Err",
        message: "Mật khẩu phải có ít nhất 6 ký tự",
      });
    }
    const response = await authService.register(username, email, password);
    console.log("Register response:", response);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      status: "Err",
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "Err",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    const response = await authService.login(email, password);
    const { access_token, ...newReponse } = response;
    // res.cookie("access_token", access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    // });
    return res.status(200).json(newReponse);
  } catch (e) {
    return res.status(404).json({
      status: "Err",
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      status: "Ok",
      message: "Đăng xuất thành công",
    });
  } catch (e) {
    return res.status(404).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: "Err",
        message: "Vui lòng cung cấp đầy đủ thông tin",
      });
    }

    const response = await authService.changePassword(
      userId,
      oldPassword,
      newPassword
    );
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Lỗi hệ thống vui lòng thử lại sau!",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
};
