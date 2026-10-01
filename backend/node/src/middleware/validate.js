const { z } = require("zod");

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] || "body";
        if (!errors[field]) errors[field] = issue.message;
      }
      return res.status(400).json({ message: "Please correct the highlighted fields.", errors });
    }
    req.body = result.data;
    return next();
  };
}

const authSchema = z.object({
  email: z.string().trim().email("A valid email is required."),
  password: z.string().min(1, "Password is required.").max(128, "Password is too long."),
}).strict();

const timelineSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(80, "Title must be 80 characters or fewer."),
  date: z.string().trim().regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (0?[1-9]|[12][0-9]|3[01]), \d{4}$/, "Date must use format Mon D, YYYY (example: Apr 8, 2024)."),
  description: z.string().trim().min(1, "Description is required.").max(400, "Description must be 400 characters or fewer."),
  imageUrl: z.string().trim().max(500, "Image URL must be 500 characters or fewer.").optional().or(z.literal("")),
}).strict();

const loveNoteSchema = z.object({
  message: z.string().trim().min(1, "Message is required.").max(400, "Message must be 400 characters or fewer."),
  author: z.string().trim().min(1, "Author is required.").max(40, "Author must be 40 characters or fewer."),
  date: z.string().trim().regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (0?[1-9]|[12][0-9]|3[01]), \d{4}$/, "Date must use format Mon D, YYYY (example: Apr 8, 2024)."),
  color: z.string().trim().min(1, "Color is required.").max(60, "Color value is too long."),
}).strict();

const photoSchema = z.object({
  caption: z.string().trim().max(240, "Caption must be 240 characters or fewer.").optional().default(""),
  imageUrl: z.string().trim().min(1, "Image URL is required.").max(500, "Image URL must be 500 characters or fewer."),
}).strict();

const uploadSchema = z.object({
  folder: z.enum(["timeline", "memories"], { message: "Upload folder must be timeline or memories." }),
}).strict();

const memorySchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().optional(),
}).strict();

module.exports = {
  validateBody,
  authSchema,
  timelineSchema,
  loveNoteSchema,
  photoSchema,
  uploadSchema,
  memorySchema,
};