import express from "express";
import { cheaklogin } from "../middlewares/auth.middleware.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/search", cheaklogin, async (req, res) => {
  const q = req.query.q;
  const myId = req.user.userid;
  

  if (!q) return res.json([]);

  const users = await User.find({
    userid: { $ne: myId },
    $or: [
      { name: { $regex: q, $options: "i" } },
      { contact: { $regex: q } }
    ]
    
  }).select("userid name contact");

  res.json(users);
});


export default router;