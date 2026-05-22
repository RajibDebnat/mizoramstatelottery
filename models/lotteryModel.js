const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  slots: {
    afternoon: {
      imageUrl: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      }
    },
    night: {
      imageUrl: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      }
    }
  }
}, {
  // timestamps: true
});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;