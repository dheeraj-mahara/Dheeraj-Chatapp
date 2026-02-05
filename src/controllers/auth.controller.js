import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/user.js";



export const singupUser = async (req, res) => {
  try {
    const { name, contact, password, confirmPassword } = req.body;

    if (!name || !contact || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      contact,
      password: hash
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful"
    });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};





// -=-=================== login work   -=====-=====-=-====-




export const loginuser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 🔍 find user from MongoDB
    const user = await User.findOne({ name: username });

    if (!user) {
      return res.render("login", { error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", { error: "Wrong password" });
    }

    // 🎟 token
    const token = jwt.sign(
      { userid: user._id, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");

  } catch (err) {
    console.error("Login error:", err);
    res.render("login", { error: "Something went wrong" });
  }
};

// -=-=================== get all user   -=====-=====-=-====-



export const getAllUsers = async () => {
  try {
    const users = await User.find({}) .select("_id name contact online");

    // same structure jaisa pehle frontend expect karta tha
    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      contact: user.contact,
      online: user.online
    }));

  } catch (err) {
    console.error("❌ getAllUsers error:", err);
    return [];
  }
};
