import express from "express";
import { addStatus, getAllStatus } from "../controllers/status.controller.js";
import { cheaklogin } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/add",cheaklogin,upload.single("image"),addStatus);

router.get("/all", cheaklogin, getAllStatus);


export default router
