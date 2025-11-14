import jwt from "jsonwebtoken";

export const signToken = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
  });
  return { accessToken, refreshToken };
};

export const createSendToken = (user) => {
  if (!user) return;
  const token = signToken(user._id);
  //create cookie to store our refreshToken in order to prevent browser access on client
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true, //cookie cannot be accessed or modified by the browser
    secure: isProduction, //send cookie over HTTPS only when in prod env
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie is valid for 7days
    path: "/api/v1/auth/refresh-token", //cookie is valid on all path across your domain
    sameSite: isProduction ? "none" : "lax", //to allow cross-site cookie in production for https
  };
  return {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    cookieOptions,
  };
};
