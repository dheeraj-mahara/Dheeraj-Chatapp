import express from "express"
const router = express.Router()

import { singupUser, loginuser } from "../controllers/auth.controller.js"

router.get("/singup", (req, res) => {
  res.render("singup")
})

router.get("/login", (req, res) => {
  res.render("login")

})

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
});

router.post("/singup", singupUser);
router.post("/login", loginuser);

export default router