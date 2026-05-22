const fs = require("fs");
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const dotEnv = require("dotenv");
const cloudinary = require("cloudinary").v2;
// const imageModel =  require('./imageModel');
const mongoose = require("mongoose");
dotEnv.config({ path: "./config.env" });
const app = express();
const Image = require("./models/lotteryModel");
const { prototype } = require("events");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

cloudinary.config({
  cloud_name: "dycf0telx",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// const url = cloudinary.url("ChatGPT_Image_Feb_21_2026_03_01_08_AM_ba54zh", {
//   transformation: [
//     {
//       fetch_format: "auto",
//     },
//     {
//       quality: "auto",
//     },
//     {
//       width: 757,
//     },
//     {
//       height: 1024,
//     },
//   ],
// });
// console.log(url);
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images/uploads/");
//   },
//   filename: function (req, file, cb) {
//     console.log(file.fieldname);
//     crypto.randomBytes(12, (err, bytes) => {
//       const fn = bytes.toString("hex") + path.extname(file.originalname);
//       cb(null, fn);
//     });
//   },
// });
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const error = new Error("Only images are allowed ❌");
    error.statusCode = 400; // 👈 attach status
    cb(error, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});
const db = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("Db connection successful");
  });

// const newImage = new Image({
//   slots: {
//     afternoon: {
//       imageUrl:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-8Ne4j_5gRNNikzu_KZRIyzSihAQ74KAbiQ&s",
//       publicId: "2pm",
//     },
//     night: {
//       imageUrl:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-8Ne4j_5gRNNikzu_KZRIyzSihAQ74KAbiQ&s",
//       publicId: "9pm",
//     },
//   },
// });
// newImage.save().then((doc) => {
//   console.log(doc);
// });
// Image.create({
//   slots: {
//     afternoon: {
//       imageUrl:
//         "https://cdn.pixabay.com/photo/2017/07/24/19/57/tiger-2535888_640.jpg",
//       publicId: "2pm",
//     },
//     night: {
//       imageUrl:
//         "https://cdn.pixabay.com/photo/2017/07/24/19/57/tiger-2535888_640.jpg",
//       publicId: "9pm",
//     },
//   },
// })
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => console.log(err));

app.get("/", async (req, res) => {
  try {
    const data = await Image.findOne();

    res.render("index", {
      afternoonImg: data?.slots?.afternoon?.imageUrl || "https://via.placeholder.com/757x1024?text=No+Image",
      nightImg: data?.slots?.night?.imageUrl || "https://via.placeholder.com/757x1024?text=No+Image",
      date: new Date().toLocaleDateString("en-US", {
      })
    });

  } catch (err) {
    console.log(err);
    res.render("index", {
      afternoonImg: "",
      nightImg: ""
    });
  }
});

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/news", (req, res) => {
  res.render("news");
});

app.get("/adminfuckoffjj", (req, res) => {
  res.render("admin");
});
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const slot = req.body.slot;
    const file = req.file;

    if (!file) {
      return res.status(400).send("No image uploaded");
    }

    if (!["afternoon", "night"].includes(slot)) {
      return res.status(400).send("Invalid slot");
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "lottery",
          transformation: [
            {
              width: 757,
              height: 1024,
              crop: "fill",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    await Image.findOneAndUpdate(
      {},
      {
        $set: {
          [`slots.${slot}.imageUrl`]: result.secure_url,
          [`slots.${slot}.publicId`]: result.public_id,
        },
      },
      { upsert: true, new: true }
    );

    res.redirect("/");

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).send("Upload failed");
  }
});

    // ✅ Upload to Cloudinary
// const result = await new Promise((resolve, reject) => {
//   const stream = cloudinary.uploader.upload_stream(
//     {
//       folder: "lottery",
//       transformation: [
//         {
//           width: 757,
//           height: 1024,
//           crop: "fill",
//           quality: "auto",
//           fetch_format: "auto",
//         },
//       ],
//     },
//     (error, result) => {
//       if (error) reject(error);
//       else resolve(result);
//     }
//   );

//   stream.end(file.buffer);
// });



    // ✅ Save URL in DB
//     await Image.findOneAndUpdate(
//       {},
//       {
//         $set: {
//           [`slots.${slot}.imageUrl`]: result.secure_url,
//           [`slots.${slot}.publicId`]: result.public_id,
//         },
//       },
//       { upsert: true, new: true }
//     );

//     // ✅ Delete local file (IMPORTANT)
    

//     res.redirect("/");

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: "error",
//       message: "Upload failed ❌"
//     });
//   }
// });
// app.post(`/file/:filename`, function (req, res) {
//   console.log(req.params.filename);
//   res.send(req.params.filename);
// });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on http://localhost:3000");
});

// ✅ FIXED ROUTE
// app.post(
//   "/upload",
//   upload.fields([
//     { name: "primaryImage", maxCount: 1 },
//     { name: "supportingImage", maxCount: 1 },
//   ]),
//   async (req, res) => {

//     const primaryImage = req.files?.primaryImage?.[0];

//     if (!primaryImage) {
//       return res.send("No file uploaded ❌");
//     }

//     await imageModel.findOneAndUpdate(
//       { type: "2pm" },
//       {
//         imageUrl: `/images/uploads/${primaryImage.filename}`,
//         publicId: primaryImage.filename
//       },
//       {
//         upsert: true,
//         returnDocument: "after"
//       }
//     );

//     res.redirect("/");
//   }
// );

// storage config

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/images/uploads/");
//   },

//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname); // .jpg, .png etc

//     if (file.fieldname === "primaryImage") {
//       cb(null, "2pm" + ext); // 👉 always 2pm.jpg/png
//     } else if (file.fieldname === "supportingImage") {
//       cb(null, "9pm" + ext); // 👉 always 9pm.jpg/png
//     }
//   },
// });
// const upload = multer({ storage });
// error handler
