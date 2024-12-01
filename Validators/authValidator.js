const { z } = require("zod");

const signupSchema = z.object({
  username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be of 3 characters" })
    .max(255, { message: "Name must be of less than 255 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(10, { message: "Write correct Email" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(4, { message: "Password must be of 4 characters" })
    .max(20, { message: "Password must be of less than 20 characters" }),
  mobile: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(10, { message: "Enter the correct phone number" })
    .max(14, { message: "Incorrect phone number" }),
  role: z
    .string({ required_error: "Role is required" })
    .trim()
    .min(3, { message: "Role must be at least 3 characters" })
    .max(10, { message: "Role must be less than 10 characters" })
    .refine((role) => ['student', 'provider'].includes(role), {
      message: "Role must be either 'student' or 'provider'",
    }),
});

module.exports = signupSchema;
