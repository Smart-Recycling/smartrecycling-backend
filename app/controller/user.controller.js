import { verifyToken } from "../lib/tokenHandler.js";
import dbPool from "../lib/dbConnect.js";

export const getUser = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);

    const [userRows] = await dbPool.query("SELECT * FROM User WHERE id = ?", [data.id]);
    const user = userRows[0];

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      user: {
        uuid: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    // Check if the request is authorized with a valid admin token
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    // Verify the token and ensure the user has an admin role
    const data = verifyToken(req.headers.access_token);
    const [adminUser] = await dbPool.query("SELECT * FROM User WHERE id = ? AND role = 'ADMIN'", [data.id]);

    if (!adminUser || adminUser.length === 0) {
      return res.status(403).json({
        status: 403,
        message: "Forbidden: Admin access required",
      });
    }

    // Fetch all users
    const [usersRows] = await dbPool.query("SELECT * FROM User");
    const users = usersRows;

    res.json({
      status: 200,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const postPointByUserId = async (req, res, next) => {
  try {
    const { uuid, points } = req.body;

    if (!uuid || points === undefined) {
      return res.status(400).json({
        status: 400,
        message: "UUID and points must be provided in the request body.",
      });
    }

    // Update the user's points based on the provided UUID
    await dbPool.query("UPDATE User SET points = ? WHERE id = ?", [points, uuid]);

    // Fetch the updated user details
    const [updatedUserRows] = await dbPool.query("SELECT * FROM User WHERE id = ?", [uuid]);
    const updatedUser = updatedUserRows[0];

    res.json({
      status: 200,
      message: "Points updated successfully",
      user: {
        uuid: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        points: updatedUser.points,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const { uuid, newRole } = req.body;

    if (!uuid || !newRole) {
      return res.status(400).json({
        status: 400,
        message: "UUID and newRole must be provided in the request body.",
      });
    }

    // Update the user's role based on the provided UUID
    await dbPool.query("UPDATE User SET role = ? WHERE id = ?", [newRole, uuid]);

    // Fetch the updated user details
    const [updatedUserRows] = await dbPool.query("SELECT * FROM User WHERE id = ?", [uuid]);
    const updatedUser = updatedUserRows[0];

    res.json({
      status: 200,
      message: "User role updated successfully",
      user: {
        uuid: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        points: updatedUser.points,
      },
    });
  } catch (error) {
    next(error);
  }
};
