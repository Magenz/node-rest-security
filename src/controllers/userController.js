import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserSchema } from "../models/userModel";
import { response } from "express";

const User = mongoose.model("User", UserSchema);

//Validation
export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};

//Register
export const register = (req, res) => {
  const newUser = new User(req.body);
  newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).send({ message: err });
    } else {
      user.hashPassword = undefined;
      return res.json(user);
    }
  });
};

//Login

export const login = (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) throw err;
      if (!user) {
        res.status(401).json({ message: "Auth Failed. no user found" });
      } else if (user) {
        if (!user.comparePassword(req.body.password, user.hashPassword)) {
          res.status(401).json({ message: "Auth failed. Wrong Password" });
        } else {
          return res.json({
            token: jwt.sign(
              {
                email: user.email,
                username: user.username,
                _id: user.id,
              },
              "RESTFULAPIs"
            ),
          });
        }
      }
    }
  );
};
