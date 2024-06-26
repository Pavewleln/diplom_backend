import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import multer from 'multer'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

// Routes import
import AuthRoute from './routes/auth.js'
import ProductRoute from './routes/product.js'
import CommentRoute from './routes/comment.js'
import TechRoute from './routes/tech.js'


const app = express()
const port = process.env.PORT || 4000

app.use(express.json());
app.use(cookieParser())
app.use(cors())
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage})
app.post('/upload', upload.single('images'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`
    })
})

app.use('/auth', AuthRoute)
app.use('/products', ProductRoute)
app.use('/comments', CommentRoute)
app.use('/tech', TechRoute)

mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log("\nDB ok")
        app.listen(port, async (err) => {
            if (err) console.log(err)
            console.log(`\nServer has been started!\nURL: http://localhost:${port}`)
        })
    })
    .catch((err) => { console.log("DB error", err) })
