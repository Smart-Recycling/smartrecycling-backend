import dbPool from "../lib/dbConnect.js";

export const getTransactionHistory = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // Check if the user exists
    const [userResult] = await dbPool.query("SELECT * FROM User WHERE id = ?", [user_id]);

    if (userResult.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Retrieve transaction history for the user
    const [transactionHistory] = await dbPool.query("SELECT * FROM ExchangeTransaction et " + "INNER JOIN Item i ON et.items_id = i.id " + "WHERE et.user_id = ?", [user_id]);

    res.status(200).json({
      status: 200,
      data: transactionHistory,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransactionPayment = async (req, res, next) => {
  try {
    const { transaction_id, payment_method_id, amount, status } = req.body;

    // Check if the associated transaction and payment method exist
    const [transactionResult] = await dbPool.query("SELECT * FROM ExchangeTransaction WHERE id = ?", [transaction_id]);
    const [paymentMethodResult] = await dbPool.query("SELECT * FROM PaymentMethod WHERE id = ?", [payment_method_id]);

    if (transactionResult.length === 0 || paymentMethodResult.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Transaction or PaymentMethod not found",
      });
    }

    // Insert transaction payment into the database
    const [createdTransactionPayment] = await dbPool.query("INSERT INTO TransactionPayment (transaction_id, payment_method_id, amount, status) VALUES (?, ?, ?, ?)", [transaction_id, payment_method_id, amount, status]);

    res.status(201).json({
      status: 201,
      data: createdTransactionPayment,
    });
  } catch (error) {
    next(error);
  }
};
