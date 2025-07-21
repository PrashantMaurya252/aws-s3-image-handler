import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectToDB } from './utils/connectToDB.js'
import imageRoutes from './routes/image-routes.js'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

connectToDB()
app.use('/api/image',imageRoutes)

app.listen(3000,()=>{
    console.log('Your App is running on port 3000')
})
