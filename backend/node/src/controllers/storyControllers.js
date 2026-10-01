const prisma = require("../utils/prisma");

const datePattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (0?[1-9]|[12][0-9]|3[01]), \d{4}$/;

function validationError(errors) {
  return { message: "Please correct the highlighted fields.", errors };
}

function validateTimeline(body) {
  const errors = {};
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const date = typeof body?.date === "string" ? body.date.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";

  if (!title) errors.title = "Title is required.";
  else if (title.length > 80) errors.title = "Title must be 80 characters or fewer.";
  if (!date) errors.date = "Date is required.";
  else if (!datePattern.test(date)) errors.date = "Date must use format Mon D, YYYY (example: Apr 8, 2024).";
  if (!description) errors.description = "Description is required.";
  else if (description.length > 400) errors.description = "Description must be 400 characters or fewer.";
  if (imageUrl.length > 500) errors.imageUrl = "Image URL must be 500 characters or fewer.";

  return { errors, value: { title, date, description, imageUrl: imageUrl || null } };
}

function validateNote(body) {
  const errors = {};
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const author = typeof body?.author === "string" ? body.author.trim() : "";
  const date = typeof body?.date === "string" ? body.date.trim() : "";
  const color = typeof body?.color === "string" ? body.color.trim() : "";

  if (!message) errors.message = "Message is required.";
  else if (message.length > 400) errors.message = "Message must be 400 characters or fewer.";
  if (!author) errors.author = "Author is required.";
  else if (author.length > 40) errors.author = "Author must be 40 characters or fewer.";
  if (!date) errors.date = "Date is required.";
  else if (!datePattern.test(date)) errors.date = "Date must use format Mon D, YYYY (example: Apr 8, 2024).";
  if (!color) errors.color = "Color is required.";
  else if (color.length > 60) errors.color = "Color value is too long.";

  return { errors, value: { message, author, date, color } };
}

function validatePhoto(body) {
  const errors = {};
  const caption = typeof body?.caption === "string" ? body.caption.trim() : "";
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";

  if (!imageUrl) errors.imageUrl = "Image URL is required.";
  else if (imageUrl.length > 500) errors.imageUrl = "Image URL must be 500 characters or fewer.";
  if (caption.length > 240) errors.caption = "Caption must be 240 characters or fewer.";

  return { errors, value: { caption, imageUrl } };
}

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function registerCrud(router, model, validate, singular, responseKey, validateRequest) {
  router.get("/", async (_req, res) => res.json(await prisma[model].findMany({ orderBy: { id: "asc" } })));

  router.post("/", validateRequest, async (req, res) => {
    const result = validate(req.body);
    if (Object.keys(result.errors).length) return res.status(400).json(validationError(result.errors));
    const record = await prisma[model].create({ data: result.value });
    res.status(201).json({ message: `${singular} created.`, [responseKey]: record });
  });

  router.put("/:id", validateRequest, async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: `Please provide a valid ${singular.toLowerCase()} ID.` });
    const result = validate(req.body);
    if (Object.keys(result.errors).length) return res.status(400).json(validationError(result.errors));
    try {
      const record = await prisma[model].update({ where: { id }, data: result.value });
      res.json({ message: `${singular} updated.`, [responseKey]: record });
    } catch (error) {
      if (error.code === "P2025") return res.status(404).json({ message: `No ${singular.toLowerCase()} was found for that ID.` });
      throw error;
    }
  });

  router.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: `Please provide a valid ${singular.toLowerCase()} ID.` });
    try {
      await prisma[model].delete({ where: { id } });
      res.json({ message: `${singular} deleted.` });
    } catch (error) {
      if (error.code === "P2025") return res.status(404).json({ message: `No ${singular.toLowerCase()} was found for that ID.` });
      throw error;
    }
  });
}

module.exports = {
  registerCrud,
  validateTimeline,
  validateNote,
  validatePhoto,
};