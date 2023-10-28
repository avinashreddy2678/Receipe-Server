import express from "express";
import { UserModal } from "../Models/UserModal.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const salt = 10;
const router = express.Router();
dotenv.config();
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await UserModal.findOne({ email });
  if (user) {
    return res.status(201).json({ message: "User exists" });
  }
  bcrypt.hash(password, salt, function (err, hash) {
    const newUser = new UserModal({
      username: username,
      email: email,
      password: hash,
    });
    newUser.save();
    return res.status(200).json({ message: "Success" });
  });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModal.findOne({ email });
  if (!user) {
    return res.status(201).json({ message: "User not exists" });
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (!result) {
      return res.status(201).json({ message: "User password incorrect" });
    }

    // console.log("User logged in successfully");
    const token = jwt.sign({ id: user._id }, process.env.SECREAT);
    res.json({
      token,
      Userid: user._id,
      name: user.username,
      message: "User logged in successfully",
    });
  });
});
export { router as userrouter };

//verfying token

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECREAT, async(err) => {
      if (err) {
        return res.sendStatus(404);
      }
      next();
    });
  } else {
    res.sendStatus(405);
  }
};
