import * as jwt from "jsonwebtoken";
import * as hash from "password-hash";
import { User } from "../models";
import { SECRET } from "../config";

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password: hash.generate(password),
  });
  const token = jwt.sign(
    {
      id: user.get("id"),
      name,
      email,
      password,
    },
    SECRET
  );
  res.json({
    msg: "user saved",
    token,
  });
};

const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

const verifyEmail = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({
    where: {
      email,
    },
  });
  res.json({ created: user !== null });
};

const logInUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (hash.verify(password, user.get("password"))) {
    const token = jwt.sign(
      {
        id: user.get("id"),
        name: user.get("name"),
        email,
        password,
      },
      SECRET
    );
    res.json({ token });
  } else {
    res.status(403).json({ msg: "wrong password" });
  }
};

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const { id } = req.params;
  const user = await User.update(
    { name, email, password: hash.generate(password) },
    {
      where: {
        id,
      },
    }
  );
  const token = jwt.sign(
    {
      id,
      name,
      email,
      password,
    },
    SECRET
  );
  res.json({ msg: "user updated", token });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.destroy({
    where: {
      id,
    },
  });
  res.json({ msg: "user deleted" });
};

export {
  getAllUsers,
  createUser,
  verifyEmail,
  logInUser,
  updateUser,
  deleteUser,
};
