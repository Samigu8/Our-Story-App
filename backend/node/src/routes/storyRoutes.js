const express = require("express");
const { registerCrud, validateTimeline, validateNote, validatePhoto } = require("../controllers/storyControllers");

const timelineRoutes = express.Router();
registerCrud(timelineRoutes, "timelineEvent", validateTimeline, "Timeline event", "event");

const loveNoteRoutes = express.Router();
registerCrud(loveNoteRoutes, "loveNote", validateNote, "Love note", "note");

const photoRoutes = express.Router();
registerCrud(photoRoutes, "photo", validatePhoto, "Photo", "photo");

module.exports = { timelineRoutes, loveNoteRoutes, photoRoutes };