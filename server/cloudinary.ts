import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer - Paintings
const paintingStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'atelier-gallery/paintings', // Organize uploads in a folder
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Restrict file types
      transformation: [
        {
          width: 1200,
          height: 900,
          crop: 'limit',
          quality: 'auto:good',
          format: 'auto'
        }
      ],
      public_id: `painting-${Date.now()}`, // Unique filename
    };
  },
});

// Configure Cloudinary storage for Artist Photos
const artistStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'atelier-gallery/artists', // Organize uploads in a folder
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Restrict file types
      transformation: [
        {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto:good',
          format: 'auto'
        }
      ],
      public_id: `artist-${Date.now()}`, // Unique filename
    };
  },
});

// Configure multer with Cloudinary storage for paintings
export const upload = multer({
  storage: paintingStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const error = new Error('Only image files are allowed!') as any;
      cb(error);
    }
  },
});

// Configure multer with Cloudinary storage for artist photos
export const uploadArtistPhoto = multer({
  storage: artistStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for artist photos
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const error = new Error('Only image files are allowed!') as any;
      cb(error);
    }
  },
});

// Helper function to delete images from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number): string => {
  return cloudinary.url(publicId, {
    width: width || 800,
    height: height || 600,
    crop: 'fill',
    quality: 'auto:good',
    format: 'auto',
    fetch_format: 'auto',
  });
};

export default cloudinary;