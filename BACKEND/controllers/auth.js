import User from "../models/User.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return next(new ErrorResponse("Please provide all required fields", 400));
  }
  const user = await User.create({
    name,
    username,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    token: user.getSignedJwtToken(),
    user: { id: user._id, name: user.name, email: user.email, channelId: user.channelId },
  });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  sendTokenResponse(user, 200, res);
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
 
  res.status(200).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, channelId: user.channelId },
  });
});

// @desc      Get current logged-in user
// @route     GET /api/v1/auth/me
// @access    Private
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      channelId: user.channelId, 
    },
  });
};