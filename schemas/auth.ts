import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is not valid",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  username: z.string().min(3, {
    message: "Minimum username is 3 characters",
  }),
  email: z.string().email({
    message: "Email is not valid",
  }),
  password: z.string().min(6, {
    message: "Minimum password is 6 characters",
  }),
  passwordConfirmation: z.string().min(1, {
    message: "Minimum password confirmation is required",
  }),
});

export const generateRegisterSchema = (type: "CREATE" | "UPDATE") => {
  if (type === "UPDATE") {
    return z.object({
      username: z.string().min(3, {
        message: "Minimum username is 3 characters",
      }),
      email: z.string().email({
        message: "Email is not valid",
      }),
      role: z.string().optional().default("USER"),
      password: z.string().optional(),
      passwordConfirmation: z.string().optional(),
    });
  }

  return z.object({
    username: z.string().min(3, {
      message: "Minimum username is 3 characters",
    }),
    email: z.string().email({
      message: "Email is not valid",
    }),
    role: z.string().optional().default("USER"),
    password: z.string().min(6, {
      message: "Minimum password is 6 characters",
    }),
    passwordConfirmation: z.string().min(1, {
      message: "Minimum password confirmation is required",
    }),
  });
};
