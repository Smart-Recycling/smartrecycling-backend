import dbPool from "../lib/dbConnect.js";
import bcryptjs from "bcryptjs";
import { generateToken, hashRefreshToken } from "../lib/tokenHandler.js";
import { v4 as uuidv4 } from "uuid";

export const authController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Generate a UUID for the user
      const userId = uuidv4();

      // Check if the user already exists
      const [existingUsers] = await dbPool.query("SELECT * FROM User WHERE email = ?", [email]);

      if (existingUsers.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "Email address is already in use.",
        });
      } else {
        // Hash the password
        const saltRounds = 12;
        const hashPassword = await bcryptjs.hash(password, saltRounds);

        // Insert the new user with the generated UUID
        const [result] = await dbPool.query("INSERT INTO User (id, name, email, password, points, role) VALUES (?, ?, ?, ?, 0, 'USER')", [userId, name, email, hashPassword]);

        res.status(201).json({ success: true, data: result });
      }
    } catch (error) {
      next(error);
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Retrieve the user by email
      const [users] = await dbPool.query("SELECT * FROM User WHERE email = ?", [email]);
      const user = users[0];

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      // Compare the password
      const passwordMatch = await bcryptjs.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(422).json({
          status: 422,
          message: "Incorrect password!",
        });
      }

      // Generate access and refresh tokens
      const access_token = generateToken({ id: user.id });
      const refresh_token = generateToken({ id: user.id }, false);
      const md5Refresh = hashRefreshToken(refresh_token);

      // Check if a refresh token already exists for the user
      const [existingRefreshToken] = await dbPool.query("SELECT * FROM RefreshToken WHERE user_id = ?", [user.id]);

      if (existingRefreshToken.length > 0) {
        // Update existing refresh token
        await dbPool.query("UPDATE RefreshToken SET token = ? WHERE user_id = ?", [md5Refresh, user.id]);

        res.json({
          status: 200,
          access_token,
          refresh_token: md5Refresh,
        });
      } else {
        // Create new refresh token
        await dbPool.query("INSERT INTO RefreshToken (user_id, token) VALUES (?, ?)", [user.id, md5Refresh]);

        res.json({
          status: 200,
          access_token,
          refresh_token: md5Refresh,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
