const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jobs = require("./jobs");

const userSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid Email");
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rate: {
      type: Number,
      default: 0,
      required: true,
    },

    jobCompleted: {
      type: Number,
      default: 0,
      required: true,
    },

    reviewCount: {
      type: Number,
      default: 0,
      required: true,
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],

    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("appliedJobs", {
  ref: "EmployeeJobs",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("pastJobs", {
  ref: "EmployeeJobs",
  localField: "_id",
  foreignField: "employerID",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Unable to login");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Incorrect Password");

  return user;
};

//Hash the plain text password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//Delete the jobs posted by the user when user get deleted

userSchema.pre("remove", async function (next) {
  const user = this;
  if (user.userType === "employer") await jobs.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
