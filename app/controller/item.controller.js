import { verifyToken } from "../lib/tokenHandler.js";
import dbPool from "../lib/dbConnect.js";

export const getItems = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    verifyToken(req.headers.access_token);

    const [itemRows] = await dbPool.query("SELECT * FROM Item");
    const items = itemRows;

    res.json({
      status: 200,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const createItem = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);
    const { name, points, total } = req.body;

    const [createdItem] = await dbPool.query("INSERT INTO Item (name, points, total) VALUES (?, ?, ?)", [name, points, total]);

    res.status(201).json({
      status: 201,
      data: createdItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);
    const { index } = req.params; // Assuming the index is part of the request URL

    const existingItem = await dbPool.query("SELECT * FROM Item WHERE id = ?", [index]);

    if (!existingItem.length) {
      return res.status(404).json({
        status: 404,
        message: "Item not found",
      });
    }

    const { name, points, total } = req.body;

    await dbPool.query("UPDATE Item SET name = ?, points = ?, total = ? WHERE id = ?", [name, points, total, index]);

    const [updatedItemRows] = await dbPool.query("SELECT * FROM Item WHERE id = ?", [index]);
    const updatedItem = updatedItemRows[0];

    res.status(200).json({
      status: 200,
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};
