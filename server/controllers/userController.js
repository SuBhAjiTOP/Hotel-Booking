import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const getUser = async (req, res) => {
  const { token } = req.body;
  try {
    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    const { id, expires } = decrypted;
    if (new Date(Date.now()) < new Date(expires)) {
      const user = await User.findById(id);
      return res.status(200).json({
        status: true,
        user: {
          name: user.name,
          id: user._id,
          isAdmin: user.isAdmin,
          avatar: user.avatar,
        },
      });
    }

    return res.status(202).json({
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error !!" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(201)
        .json({ status: false, message: "User Already Exists !!" });
    }

    const hashedPassword = bcrypt.hashSync(password);

    if (req.files) {
      const result = await cloudinary.v2.uploader.upload(
        req.files.avatar.tempFilePath,
        {
          folder: "userAvatars",
        }
      );

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar: result.secure_url,
      });

      await newUser.save();
    } else {
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
    }

    return res
      .status(200)
      .json({ status: true, message: "User Registered Successfully !!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Interna Server Error !!" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res
        .status(201)
        .json({ status: false, message: "User Not Available!!" });
    }

    const isMatch = bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res
        .status(201)
        .json({ status: false, message: "Invalid Credentials !!" });
    }

    const payload = {
      id: existingUser._id,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res
      .status(200)
      .json({ status: true, message: "Logged In Successfully!!!", token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
