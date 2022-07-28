const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const protect = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");

const loginFunction = async (req, user) => {
  if (user._id) {
    req.session.userId = user._id;
    // console.log(req.session);
  }
};
const sendMail = async ({ randCode, email }) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ds801015@gmail.com",
      pass: "rexxwodausgsnpza",
    },
  });

  let sentMail = await transporter.sendMail({
    from: '"Devesh" "<ds801015@gmail.com>"',
    to: email,
    subject: "Confirmation Code",
    html: `<h3>This is your confirmation code for PhotoStock, this code willl be valid for 15 minutes</h3> <h2>${randCode}</h2>`,
  });
  console.log(sentMail);
};

router.post("/validateEmail", async (req, res) => {
  // console.log(req.body);
  const { randCode, email } = req.body;
  console.log("this is the random code" + randCode);
  const data = await sendMail({ randCode, email });
  res.json(data);
});
router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    try {
      const newUser = req.body;
      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      const user = new User({ ...newUser, password: hashedPassword });
      await user.save();
      loginFunction(req, user);
      user.populate("favPhotos");
      res.json({
        user: {
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          favPhotos: user.favPhotos,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400);
      if (e.message.includes("validation")) {
        throw new Error("Please enter all the fields", 400);
      } else if (e.message.includes("duplicate")) {
        throw new Error("User already exist");
      } else {
        throw new Error("Cant create user right now");
      }
    }
  })
);

router.post(
  "/login",
  expressAsyncHandler(async (req, res, next) => {
    // sendMail();
    const { email, password } = req.body;
    // console.log(req.body);
    const existingUser = await User.findOne({ email }).populate("favPhotos");
    if (!existingUser || !email || !password) {
      console.log("user doesnt exist");
      res.status(400);
      throw new Error("Wrong Credentials");
    }
    const passwordMatch = bcrypt.compareSync(password, existingUser.password);
    if (!passwordMatch) {
      console.log("password doesnt match");
      res.status(400);

      throw new Error("Wrong Credentials");
    }
    // console.log(existingUser);
    loginFunction(req, existingUser);
    // existingUser.populate("favPhotos");
    res.json({
      user: {
        userId: existingUser._id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        favPhotos: existingUser.favPhotos,
      },
    });
  })
);

//proile route
router.get(
  "/profile",
  // protect,
  expressAsyncHandler(async (req, res) => {
    // console.log(req.session);
    try {
      // console.log(req.session);

      // console.log(req.session);
      if (req.session.userId) {
        const { userId } = req.session;
        const user = await User.findById(userId).populate("favPhotos");
        // user.populate("favPhotos");
        // console.log(user);
        res.json({
          user: {
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            favPhotos: user.favPhotos,
          },
        });
      } else {
        // console.log("it is not runnung");
        res.json({ user: null, message: "this is not working" });
      }
    } catch (e) {
      console.log("not running");
      // console.log(e);
    }
  })
);

//logout route
router.post(
  "/logout",
  protect,
  expressAsyncHandler(async (req, res) => {
    req.session.destroy();
    res.send("user logged out");
  })
);

//getting a user
router.get(
  "/:userId",
  protect,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.json(user);
  })
);
//adding fav Photo
router.patch(
  "/:userId",
  protect,
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { photoId } = req.body;
    // console.log(photoId);
    // console.log(userId);

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(400);
      throw new Error("User not found");
    }
    // console.log(existingUser.favPhotos);
    if (existingUser.favPhotos.includes(photoId)) {
      console.log("removed");
      existingUser.favPhotos = existingUser.favPhotos.filter(
        (photo) => photo != photoId
      );
    } else {
      console.log("added");
      existingUser.favPhotos.push(photoId);
    }
    existingUser.populate("favPhotos");
    await existingUser.save();

    res.json({
      userId: existingUser._id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      favPhotos: existingUser.favPhotos,
    });
  })
);

module.exports = router;
