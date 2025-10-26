import express, { type Request, type Response, type NextFunction } from "express"
import cors from 'cors'
import dotenv from "dotenv"
import { authRoutes } from "./routes/auth.js"
import { emailRoutes } from "./routes/emails.js"
import { classificationRoutes } from "./routes/classification.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }),
)
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/emails", emailRoutes)
app.use("/api/classify", classificationRoutes)

app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
