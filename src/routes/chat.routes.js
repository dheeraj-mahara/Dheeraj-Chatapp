import express from "express"
import fs from "fs";
import { cheaklogin } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../controllers/auth.controller.js";
import { openchatPage, sendMessage, imagework, getLastMessagesForUser } from "../controllers/chat.controller.js";
import multer from "multer";
import { upload } from "../middlewares/upload.middleware.js";
import { getChatData } from "../services/chat.service.js";


 //  multer work for image

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});




const router = express.Router();

router.get("/", cheaklogin, openchatPage);

router.post("/upload-image", upload.single("image"), imagework);
router.get("/:receiverId", cheaklogin, openchatPage);
router.post("/:receiverId/message", cheaklogin, sendMessage);

router.get("/:receiverId/data", cheaklogin, async (req, res) => {
  const sender = req.user;
  const receiverId = req.params.receiverId; 

  const chatData = await getChatData(sender, receiverId);
  res.json(chatData);
});



export default router;
