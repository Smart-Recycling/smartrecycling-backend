import express from "express"
import cors from "cors"
import routes from "./app/routes/routes.js"

const app = express()
const port = process.env.PORT || 3001
const host = process.env.HOST || "https://api.smart-recycling.my.id/api-docs/"

const corsOptions = {
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

app.get("/", function (req, res) {
  res.send("Go to /api/{endpoint}")
})

app.use("/api", routes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
