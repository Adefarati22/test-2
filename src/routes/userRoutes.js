import express from "express";
import {
  authenticateUser,
  forgotPassword,
  login,
  logout,
  refreshAccessToken,
  register,
  resendVerificationToken,
  resetPassword,
  verifyUserAccount,
} from "../controllers/userContoller.js";
import { validateFormData } from "../middlewares/validateForm.js";
import {
  forgotPasswordSchema,
  validateAccountSchema,
  validateResetPasswordSchema,
  validateSignInSchema,
  validateSignUpSchema,
} from "../utils/dataSchema.js";
import { verifyAuth } from "../middlewares/authenticate.js";
import { rateLimiter, refreshTokenLimit } from "../middlewares/rateLimit.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";

const router = express.Router();

router.post("/create", validateFormData(validateSignUpSchema), register);
router.post(
  "/login",
  rateLimiter,
  validateFormData(validateSignInSchema),
  login
);

router.get(
  "/user",
  verifyAuth,
  cacheMiddleware("auth_user", 3600),
  authenticateUser
);

router.post("/refresh-token", refreshAccessToken);

router.patch(
  "/verify-account",
  rateLimiter,
  verifyAuth,
  validateFormData(validateAccountSchema),
  clearCache("auth_user"),
  verifyUserAccount
);

router.post(
  "/resend/verify-token",
  rateLimiter,
  verifyAuth,
  resendVerificationToken
);

router.post(
  "/forgot-password",
  rateLimiter,
  validateFormData(forgotPasswordSchema),
  forgotPassword
);

router.patch(
  "/reset-password",
  rateLimiter,
  validateFormData(validateResetPasswordSchema),
  resetPassword
);

router.post("/logout", verifyAuth, clearCache("auth_user"), logout);

export default router;
