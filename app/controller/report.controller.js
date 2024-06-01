import dbPool from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

export const getReport = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);

    const [reportRows] = await dbPool.query("SELECT * FROM Report");
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
    const [createdReport] = await dbPool.query("INSERT INTO Report (email, subject, location, user_id) VALUES (?, ?, ?, ?)", [email, subject, location, user_id]);

    res.status(201).json({
      status: 201,
      data: createdReport,
    });
  } catch (error) {
    next(error);
  }
};
