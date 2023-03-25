import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import { authenticate } from '../middlewares/authMiddleware.js';
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import cloudinary from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config()




//cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


// sendgrid

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const signup = async (req, res) => {
    console.log("Signup Hit");
    try {
        // validation
        const { name, email, password } = req.body;
        if (!name) {
            return res.json({
                error: "Name is required",
            });
        }
        if (!email) {
            return res.json({
                error: "Email is required",
            });
        }
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and should be 6 characters long",
            });
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: "Email is taken",
            });
        }
        // hash password
        const hashedPassword = await hashPassword(password);
        try {
            const user = await new User({
                name,
                email,
                password: hashedPassword,
            }).save();
            // create signed token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            //   console.log(user);
            const { password, ...rest } = user._doc;
            return res.json({
                token,
                user: rest,
            });
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // check if our db has user with that email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: "No user found",
            });
        } else {
            // check password
            const match = await comparePassword(password, user.password);
            if (!match) {
                return res.json({
                    error: "Invalid Credentials",
                });
            }
            // create signed token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
            user.password = undefined;
            user.secret = undefined;
            res.json({
                token,
                user,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    console.log("USER ===> ", user);
    if (!user) {
        return res.json({ error: "User not found" });
    }
    // generate code
    const resetCode = nanoid(5).toUpperCase();
    // save to db
    user.resetCode = resetCode;
    user.save();
    // prepare email
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password reset code",
        html: `<h1>Your password reset code is: ${resetCode}</h1>`,
    };
    // send email
    try {
        const data = await sgMail.send(emailData);
        console.log(data);
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        res.json({ ok: false });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password, resetCode } = req.body;
        // find user based on email and resetCode
        const user = await User.findOne({ email, resetCode });
        // if user not found
        if (!user) {
            return res.json({ error: "Email or reset code is invalid" });
        }
        // if password is short
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and should be 6 characters long",
            });
        }
        // hash password
        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        user.resetCode = "";
        user.save();
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
    }
};

export const uploadImage = async (req, res) => {

    try {
        const result = await cloudinary.uploader.upload(req.body.image, {
            public_id: nanoid(),
            resource_type: 'jpg',
        } )
        console.log(req.body.user);
        const user = await User.findByIdAndUpdate(
            req.body.user._id,
            {
                image: {
                    public_id: result.public_id,
                    url: result.secure_url,
                },
            },
            { new: true }
        )
        return res.json({
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image
        })
    } catch (err) {
        console.log(err)
    }
}

export const updatePassword = async (req, res) => {
    try {
      const { password, newPassword } = req.body;
  
      if (newPassword && newPassword.length < 6) {
        return res.json({ error: "New password must be at least 6 characters" });
      }
  
      const user = await User.findById(req.body.user.user._id);
      const isMatch = await comparePassword(password, user.password);
  
      if (!isMatch) {
        return res.json({ error: "Invalid current password" });
      }
  
      const hashedPassword = await hashPassword(newPassword);
      const updatedUser = await User.findByIdAndUpdate(
        req.body.user.user._id,
        { password: hashedPassword },
        { new: true } // gets updated document ? 
      );
      updatedUser.password = undefined;
      updatedUser.secret = undefined;
  
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.json({ error: "Something went wrong" });
    }
  };
  
  export const sendRequest = async (req, res) => {
    console.log("sendRequest called with params:", req.params);
    const friendId = req.params.id;
  
    try {
      const user = await User.findById(req.user._id);
      console.log("User found:", user);
  
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.friendRequests.includes(friendId)) {
        console.log("Friend request already sent");
        return res.status(400).json({ message: 'Friend request already sent' });
      }
  
      user.friendRequests.push(friendId);
      await user.save();
      console.log("Friend request saved");
  
      res.json({ message: 'Friend request sent' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

export const acceptRequest = async (req, res) => {
    const friendId = req.params.id;
    
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: `User with ID ${req.user.id} not found` });
      }
  
      if (!user.friendRequests.includes(friendId)) {
        return res.status(400).json({ message: 'Friend request not found' });
      }
  
      user.friendRequests = user.friendRequests.filter((id) => id !== friendId);
      user.friends.push(friendId);
      await user.save();
  
      const friend = await User.findById(friendId);
      if (!friend) {
        return res.status(404).json({ message: `Friend with ID ${friendId} not found` });
      }
      friend.friends.push(req.user.id);
      await friend.save();
  
      res.json({ message: 'Friend request accepted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
}

export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friendRequests', 'name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ friendRequests: user.friendRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
