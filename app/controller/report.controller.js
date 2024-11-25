import dbPool from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

const connection = dbPool();

export const getReport = async (req, res, next) => {
  try {
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);

    const [reportRows] = await connection.query("SELECT * FROM Report");
    const report = reportRows;

    res.json({
      status: 200,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const createReport = async (req, res, next) => {
  try {
    const { email, subject, location, user_id } = req.body;

    // Insert the report using raw SQL
    const [createdReport] = await connection.query("INSERT INTO Report (email, subject, location, user_id) VALUES (?, ?, ?, ?)", [email, subject, location, user_id]);

    res.status(201).json({
      status: 201,
      data: createdReport,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (req, res, next) => {
  try {
    const { email, subject, location, user_id } = req.body;
    const { id } = req.params;

    // Update the report using raw SQL
    const [updatedReport] = await connection.query("UPDATE Report SET email = ?, subject = ?, location = ?, user_id = ? WHERE id = ?", [email, subject, location, user_id, id]);

    res.json({
      status: 200,
      data: updatedReport,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete the report using raw SQL
    const [deletedReport] = await connection.query("DELETE FROM Report WHERE id = ?", [id]);

    res.json({
      status: 200,
      data: deletedReport,
    });
  } catch (error) {
    next(error);
  }
};