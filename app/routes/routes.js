import { Router } from "express"
import { tokenValidation } from "../lib/tokenHandler.js"
import { getEvent, createEvent, updateEvent } from "../controller/event.controller.js"
import { authController } from "../controller/auth.controller.js"
import { createExchangeTransaction, getExchangeTransactions, getExchangeTransactionsByUserId } from "../controller/exchange.controller.js"
import { createReport, getReport, deleteReport, updateReport } from "../controller/report.controller.js"
import { getUser, postPointByUserId, changeUserRole, getAllUsers } from "../controller/user.controller.js"
import { getPaymentHistory, createPaymentMethod } from "../controller/payment.controller.js"
import { getTransactionHistory, createTransactionPayment } from "../controller/transaction.controller.js"
import { getItems, createItem, updateItem } from "../controller/item.controller.js"

const router = Router({ strict: true })

// Public routes (no token required)
router.post("/signup", authController.signUp)
router.post("/signin", authController.signIn)
router.post("/signout", authController.signOut)

// Protected routes (require token)
router.get("/events", tokenValidation(), getEvent)
router.post("/events", tokenValidation(), createEvent)
router.put("/events/:id", tokenValidation(), updateEvent)

router.get("/exchange", tokenValidation(), getExchangeTransactions)
router.post("/exchange", tokenValidation(), createExchangeTransaction)
router.get("/exchange/:user_id", tokenValidation(), getExchangeTransactionsByUserId)

router.get("/report", tokenValidation(), getReport)
router.post("/report", tokenValidation(), createReport)
router.delete("/report/:id", tokenValidation(), deleteReport)
router.put("/report/:id", tokenValidation(), updateReport)

router.get("/items", tokenValidation(), getItems)
router.post("/items", tokenValidation(), createItem)
router.put("/items/:id", tokenValidation(), updateItem)

router.get("/user", tokenValidation(), getUser)
router.post("/user/points", tokenValidation(), postPointByUserId)
router.post("/user/change-role", tokenValidation(), changeUserRole)
router.get("/users", tokenValidation(), getAllUsers)

router.get("/payment-history/:user_id", tokenValidation(), getPaymentHistory)
router.get("/transaction-history/:user_id", tokenValidation(), getTransactionHistory)
router.post("/payment-method", tokenValidation(), createPaymentMethod)
router.post("/transaction-payment", tokenValidation(), createTransactionPayment)

export default router
