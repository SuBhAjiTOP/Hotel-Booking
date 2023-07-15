import express from "express";
import {
  contactInfomessageController,
  getNotification,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/contact-admin", contactInfomessageController);
router.get("/getNotification/:id", getNotification);
export default router;
