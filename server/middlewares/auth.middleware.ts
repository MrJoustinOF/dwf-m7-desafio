import * as jwt from "jsonwebtoken";
import { SECRET } from "./../config";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.get("authorization");

  if (authHeader) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const user = jwt.verify(token, SECRET);

      if (user) next();
    } catch (error) {
      res.status(401).json({ msg: "error when validating the token" });
    }
  } else {
    res.status(400).json({ msg: "header authorization doesn't exists" });
  }
};
