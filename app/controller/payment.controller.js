import dbPool from "../lib/dbConnect.js";

export const getPaymentHistory = async (req, res, next) => {
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

    // Retrieve payment history for the user
    const [paymentHistory] = await dbPool.query(
      "SELECT * FROM TransactionPayment tp " + "INNER JOIN ExchangeTransaction et ON tp.transaction_id = et.id " + "INNER JOIN PaymentMethod pm ON tp.payment_method_id = pm.id " + "WHERE et.user_id = ?",
      [user_id]
    );

    res.status(200).json({
      status: 200,
      data: paymentHistory,
    });
  } catch (error) {
    next(error);
  }
};

export const createPaymentMethod = async (req, res, next) => {
  try {
    const { user_id, method_type, card_number, expiration_date, cvv } = req.body;

    // Check if the user exists
    const [userResult] = await dbPool.query("SELECT * FROM User WHERE id = ?", [user_id]);

    if (userResult.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Insert payment method into the database
    const [createdPaymentMethod] = await dbPool.query("INSERT INTO PaymentMethod (user_id, method_type, card_number, expiration_date, cvv) VALUES (?, ?, ?, ?, ?)", [user_id, method_type, card_number, expiration_date, cvv]);

    res.status(201).json({
      status: 201,
      data: createdPaymentMethod,
    });
  } catch (error) {
    next(error);
  }
};
