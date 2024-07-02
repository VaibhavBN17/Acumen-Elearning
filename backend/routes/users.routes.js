const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/users.models");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/users.middleware");
const { BlackListModel } = require("../models/blacklist");

const userRouter = express.Router();

// Get all users (accessible to admin)
userRouter.get("/", auth, async (req, res) => {
  try {
    if (req.body.role == "admin") {
      let users = await UserModel.find();
      res.status(200).json({ users });
    } else {
      res.status(401).json({ error: "You don't have access to users" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong", error: err.message });
  }
});

// User registration
userRouter.post("/register", async (req, res) => {
  const { name, email, password, age, city, job, image } = req.body;
  const registeredUser = await UserModel.findOne({ email });

  if (registeredUser) {
    res.status(409).json({ msg: "User already exists. Please Login!!" });
  } else {
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(404).json({ msg: err });
        } else {
          const user = new UserModel({
            name,
            email,
            password: hash,
            age,
            city,
            job,
            image,
          });
          await user.save();
          res.status(201).json({ msg: "User created successfully", user });
        }
      });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
});

// User login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        const token = jwt.sign(
          { userId: user._id, user: user.name, role: user.role },
          "SRM",
          {
            expiresIn: "7d",
          }
        );
        const rToken = jwt.sign(
          { userId: user._id, user: user.name },
          "SRM",
          {
            expiresIn: "24d",
          }
        );
        if (result) {
          res.status(202).json({ msg: "User LogIn Success", token, rToken, user });
        } else {
          res.status(401).json({ msg: "Invalid credentials" });
        }
      });
    } else {
      res.status(404).json({ msg: "User does not exist. Signup first!!" });
    }
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
});

// Update user information
userRouter.patch("/update/:userId", async (req, res) => {
  const { userId } = req.params;
  const payload = req.body;

  try {
    let insertpayload;
    if (!payload?.password) {
      delete payload.password;
      await UserModel.findByIdAndUpdate({ _id: userId }, payload);
      const user = await UserModel.findOne({ _id: userId });
      res.status(200).json({ msg: "User updated successfully", user });
      return;
    }
    bcrypt.hash(payload.password, 2, async (err, hash) => {
      if (err) {
        res.status(404).json({ msg: err });
      } else {
        insertpayload = await { ...payload, password: hash };
      }
      await UserModel.findByIdAndUpdate({ _id: userId }, insertpayload);
      const user = await UserModel.find({ _id: userId });
      res.status(200).json({ msg: "User updated successfully", user });
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Delete user (accessible to admin)
userRouter.delete("/delete/:userId", auth, async (req, res) => {
  try {
    if (req.body.role == "admin") {
      const { userId } = req.params;
      const deletedUser = await UserModel.find({ _id: userId });
      await UserModel.findByIdAndDelete({ _id: userId });
      res.status(200).json({ msg: "User has been deleted", deletedUser });
    } else {
      res.status(401).json({ error: "You don't have access to delete users" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// User logout
userRouter.post("/logout", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const newToken = BlackListModel({ token });
    newToken.save();
    res.status(200).json({ msg: "The user has logged out" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// Get courses purchased by user
userRouter.get("/userCourse/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById({ _id: userId }).populate("course");
    res.status(200).json({ course: user.course });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", error: err.message });
  }
});

// Add course to user's course array
userRouter.post("/addCourse/:courseId", auth, async (req, res) => {
  try {
    let id = req.body.userId;
    const courseId = req.params.courseId;
    
    await UserModel.findOne({ _id: id, course: { $in: [courseId] } })
      .then(async (course) => {
        if (course) {
          res.status(400).json({ error: "You already have subscribed to the course" });
        } else {
          let user = await UserModel.findByIdAndUpdate(id, {
            $push: { course: courseId },
          });
          res.status(201).json({ message: "You have subscribed to the course", user });
        }
      })
      .catch((error) => {
        console.error("Error checking course:", error);
      });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", error: err.message });
  }
});

// Update user role to "teacher"
userRouter.get("/Teachme/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "teacher";
    await user.save();

    res.status(200).json({ message: "User role updated to teacher" });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", error: err.message });
  }
});

module.exports = {
  userRouter,
};
