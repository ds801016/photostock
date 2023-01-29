const mongoose = require("mongoose");
const categories = require("../categories");

const photoSchema = mongoose.Schema(
  {
    fullUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    // thumbnailUrl: {
    //   type: String,
    //   required: true,
    // },
    category: {
      type: String,
      enum: categories,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", photoSchema);
