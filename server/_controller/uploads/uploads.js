const path = require('path');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const multer = require('multer');
const sharp = require('sharp');
const serviceAccount = require('./../../uploads-50ead-firebase-adminsdk-7z7uz-6eb0dbfc95.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'uploads-50ead.appspot.com',
});

const bucket = admin.storage().bucket();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadImage = upload.single('image');

exports.processImage = async (req, res) => {
  try {
    const uniqueFilename = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const filePath = path.join('images', uniqueFilename);

    const compressedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toBuffer();

    const fileUpload = bucket.file(filePath);
    const writeStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    writeStream.write(compressedImageBuffer);
    writeStream.end();

    writeStream
      .on('finish', async () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
        res.status(200).json({ imageUrl: publicUrl });
      })
      .on('error', (error) => {
        console.error(error);
        res.status(500).json({ error: 'Error uploading file' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading file' });
  }
};
