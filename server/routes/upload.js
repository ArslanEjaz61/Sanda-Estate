import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import auth from '../middleware/auth.js'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Setup Cloudinary storage for Images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your-homes-dubai/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    public_id: (req, file) => `image_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
  },
})

// Setup Cloudinary storage for Videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your-homes-dubai/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'webm', 'avi'],
    public_id: (req, file) => `video_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
  },
})

const uploadImages = multer({ 
  storage: imageStorage, 
  limits: { fileSize: 10 * 1024 * 1024 } 
})

const uploadVideo = multer({ 
  storage: videoStorage, 
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for videos
})

const router = express.Router()

// POST /api/upload — Upload single image
router.post('/', auth, uploadImages.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' })
    }
    res.json({ url: req.file.path, filename: req.file.filename })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/upload/multiple — Upload multiple images
router.post('/multiple', auth, uploadImages.array('images', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided.' })
    }
    const urls = req.files.map(f => f.path)
    res.json({ urls })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST /api/upload/video — Upload single video
router.post('/video', auth, uploadVideo.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided.' })
    }
    res.json({ url: req.file.path, filename: req.file.filename })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
