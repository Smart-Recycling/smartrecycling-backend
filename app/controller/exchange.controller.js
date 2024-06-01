import dbPool from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";

export const getExchangeTransactions = async (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: Bearer token required",
      });
    }

    const data = verifyToken(req.headers.access_token);

    const [exchangeTransactionRows] = await dbPool.query("SELECT * FROM ExchangeTransaction");
    const exchangeTransactions = exchangeTransactionRows;

    res.json({
      status: 200,
      data: exchangeTransactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getExchangeTransactionsByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const [exchangeTransactionRows] = await dbPool.query("SELECT * FROM ExchangeTransaction WHERE user_id = ?", [user_id]);
    const exchangeTransactions = exchangeTransactionRows;

    res.json({
      status: 200,
      data: exchangeTransactions,
    });
  } catch (error) {
    next(error);
  }
};

export const createExchangeTransaction = async (req, res, next) => {
  try {
    const { items_id, user_id } = req.body;

    // Insert the exchange transaction using raw SQL
    const [createdExchangeTransaction] = await dbPool.query("INSERT INTO ExchangeTransaction (items_id, user_id) VALUES (?, ?)", [items_id, user_id]);

    res.status(201).json({
      status: 201,
      data: createdExchangeTransaction,
    });
  } catch (error) {
    next(error);
  }
};
