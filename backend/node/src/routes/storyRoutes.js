const express = require("express");
const { registerCrud, validateTimeline, validateNote, validatePhoto } = require("../controllers/storyControllers");
const { validateBody, timelineSchema, loveNoteSchema, photoSchema } = require("../middleware/validate");

const timelineRoutes = express.Router();
registerCrud(timelineRoutes, "timelineEvent", validateTimeline, "Timeline event", "event", validateBody(timelineSchema));

const loveNoteRoutes = express.Router();
registerCrud(loveNoteRoutes, "loveNote", validateNote, "Love note", "note", validateBody(loveNoteSchema));

const photoRoutes = express.Router();
registerCrud(photoRoutes, "photo", validatePhoto, "Photo", "photo", validateBody(photoSchema));

module.exports = { timelineRoutes, loveNoteRoutes, photoRoutes };