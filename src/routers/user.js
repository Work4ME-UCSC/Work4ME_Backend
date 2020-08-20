const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const dir = "./uploads";
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, cancelUserEmail } = require("../emails/account");
const cloudinary = require("../utils/cloudinary");

const router = new express.Router();

if (!fs.existsSync(dir)) fs.mkdirSync(dir);

router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) throw new Error("User already exist");

    res.send("User not found");
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/verifyPassword", auth, async (req, res) => {
  try {
    await User.findByCredentials(req.user.email, req.body.password);
    res.send("Correct Password");
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete("/employer/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    cancelUserEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/employee/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    cancelUserEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}.${file.originalname.split(".").pop()}`);
  },
});

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5, //filesize is 5mb
  },
  fileFilter(req, file, cb) {
    console.log(file);
    if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
      cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },

  storage,
});

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    console.log(req.file.path);

    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "profile_pictures",
      folder: "profile_pictures/",
      public_id: req.user._id,
    });
    console.log(uploadResponse);
    //const buffer = await sharp(req.file.path).resize(250, 250);
    req.user.avatar = uploadResponse.url;
    await req.user.save();
    res.send({ message: "Success" });
  },
  (error, req, res, next) => {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
);

router.delete("/me/avatar", auth, async (req, res) => {
  req.user.avatar = null;
  await req.user.save();
  res.status(200).send();
});

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error("Image not found");
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send({ error: e.message });
  }
});

module.exports = router;
