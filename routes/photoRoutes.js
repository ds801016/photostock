const express = require("express");
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const protect = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("../utils/cloudinaryConfig");
const Photo = require("../models/photoModel");

//multer config
const storage = multer.diskStorage({});
const upload = multer({ storage }).single("newPhoto");
//get photos
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.query.user) {
        const photos = await Photo.find({ user: req.query.user }).populate(
          "user"
        );
        // console.log(req.session.user.userId);

        res.send(photos.reverse());
      } else {
        const photos = await Photo.find().populate("user");
        res.send(photos.reverse());
      }
    } catch (e) {
      console.log(e);
      throw new Error("something went wrong", 500);
    }
  })
);
//add photos
router.post(
  "/",
  protect,
  upload,
  expressAsyncHandler(async (req, res) => {
    try {
      //image in req.file
      //rest is in req.body
      const { userId, category } = JSON.parse(req.body.image);
      const newPhoto = req.file;
      // console.log(req.body);
      // console.log(category);
      // console.log(newPhoto);
      const uploadedImage = await cloudinary.uploader.upload(newPhoto.path);
      console.log(newPhoto.path);
      console.log(uploadedImage);
      if (!category || !newPhoto) {
        throw new Error("Please add a category and an image");
      } else if (!userId) {
        throw new Error("you are not authorzed");
      }
      const photo = new Photo({
        fullUrl: uploadedImage.secure_url,
        cloudinaryId: uploadedImage.public_id,
        originalName: newPhoto.originalname.split(".")[0],
        user: userId,
        category: category,
      });
      photo.populate("user");
      await photo.save();
      // console.log(" no error");

      res.json(photo);
    } catch (e) {
      console.log("error");
      res.status(400);
      throw new Error("Please add a category and an image");
    }
  })
);

//delete photos
router.delete(
  "/:photoId",
  protect,
  expressAsyncHandler(async (req, res) => {
    const { photoId } = req.params;
    const photo = await Photo.findOne({ cloudinaryId: photoId });
    if (photo) {
      const deletedPhoto = await Photo.deleteOne({ cloudinaryId: photoId });
      await cloudinary.uploader.destroy(photoId);
      res.send(photo);
    } else {
      throw new Error("Photo does not exist");
    }
  })
);
module.exports = router;
