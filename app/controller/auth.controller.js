import dbPool from "../lib/dbConnect.js";
import bcryptjs from "bcryptjs";
import { generateToken, hashRefreshToken } from "../lib/tokenHandler.js";
import { v4 as uuidv4 } from "uuid";

const connection = dbPool();

export const authController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const userId = uuidv4();

      const [existingUsers] = await connection.query(
        "SELECT * FROM User WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "Email address is already in use.",
        });
      }

      const saltRounds = 12;
      const hashPassword = await bcryptjs.hash(password, saltRounds);

      const [result] = await connection.query(
        "INSERT INTO User (id, name, email, password, points, role) VALUES (?, ?, ?, ?, 0, 'USER')",
        [userId, name, email, hashPassword]
      );

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const [users] = await connection.query(
        "SELECT * FROM User WHERE email = ?",
        [email]
      );
      const user = users[0];

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      const passwordMatch = await bcryptjs.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(422).json({
          status: 422,
          message: "Incorrect password!",
        });
      }

      const access_token = generateToken({ id: user.id });
      const refresh_token = generateToken({ id: user.id }, false);
      const md5Refresh = hashRefreshToken(refresh_token);

      const [existingRefreshToken] = await connection.query(
        "SELECT * FROM RefreshToken WHERE user_id = ?",
        [user.id]
      );

      if (existingRefreshToken.length > 0) {
        await connection.query(
          "UPDATE RefreshToken SET token = ? WHERE user_id = ?",
          [md5Refresh, user.id]
        );
      } else {
        await connection.query(
          "INSERT INTO RefreshToken (user_id, token) VALUES (?, ?)",
          [user.id, md5Refresh]
        );
      }

      res.json({
        status: 200,
        access_token,
        refresh_token: md5Refresh,
      });
    } catch (error) {
      next(error);
    }
  },

  signOut: async (req, res, next) => {
    try {
      const { user } = req.body;

      await connection.query("DELETE FROM RefreshToken WHERE user_id = ?", [
        user.id,
      ]);

      res.status(200).json({
        status: 200,
        message: "Successfully logged out",
      });
    } catch (error) {
      next(error);
    }
  },
};
