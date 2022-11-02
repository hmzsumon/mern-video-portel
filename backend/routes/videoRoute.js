const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const {
  getVideos,
  uploadVideo,
  getVideo,
  getRelatedVideos,
  searchVideos,
} = require('../controllers/videoController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const storage = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== '.mp4' &&
      ext !== '.mkv' &&
      ext !== '.jpeg' &&
      ext !== '.jpg' &&
      ext !== '.png'
    ) {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});

// get all videos
router.route('/videos').get(getVideos);

// upload video
router.route('/videos').post(storage.single('video'), uploadVideo);

// get a single video
router.route('/videos/:id').get(getVideo);

// get related videos
router.route('/videos/related/:id').get(getRelatedVideos);

// search videos
router.route('/search').get(searchVideos);

module.exports = router;
