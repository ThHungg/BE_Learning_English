const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { gennerateToken } = require("./jwtService");

const register = async (username, email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return { status: "Err", message: "Email đã được đăng ký" };
    }
    const hashPass = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashPass,
    });
    return {
      status: "Ok",
      message: "Đăng ký thành công",
      user: newUser,
    };
  } catch (e) {
    console.log(e);
    return { status: "Err", message: "Lỗi hệ thống vui lòng thử lại sau!" };
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { status: "Err", message: "Tài khoản không tồn tại" };
    }
    const comparePass = bcrypt.compareSync(password, user.password);
    if (!comparePass) {
      return { status: "Err", message: "Mật khẩu không đúng" };
    }
    const access_token = gennerateToken({
      id: user.id,
    });

    return {
      status: "Ok",
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        access_token,
      },
    };
  } catch (e) {
    return { status: "Err", message: "Lỗi hệ thống vui lòng thử lại sau!" };
  }
};

const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return { status: "Err", message: "Người dùng không tồn tại" };
    }
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return { status: "Err", message: "Mật khẩu cũ không đúng" };
    }
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return { status: "Ok", message: "Đổi mật khẩu thành công" };
  } catch (e) {
    console.log(e);
    return { status: "Err", message: "Lỗi hệ thống vui lòng thử lại sau!" };
  }
};

module.exports = {
  register,
  login,
  changePassword,
};
