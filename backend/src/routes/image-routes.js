import express from 'express'
import { uploadImage } from '../controller/image-controller.js'

const router = express.Router()
router.post('/upload-image',uploadImage)

export default router