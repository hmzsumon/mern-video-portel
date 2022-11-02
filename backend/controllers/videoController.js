const Video = require('../models/videoModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');

const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

// Get all videos
exports.getVideos = asyncErrorHandler(async (req, res, next) => {
  const videos = await Video.find();

  // make videos ar

  res.status(200).json({
    success: true,
    videos,
  });
});

//  Upload video
exports.uploadVideo = asyncErrorHandler(async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path, {
    resource_type: 'video',
    folder: 'videos',
  });

  // convert duration from miliseconds to minutes
  let duration = (result.duration / 60).toFixed(2);

  let thumbUrl = result.secure_url.replace('.mp4', '.webp');

  const newVideo = await Video.create({
    videoId: result.public_id,
    url: result.secure_url,
    title: req.body.title,
    description: req.body.description,
    duration: Number(duration),
    thumbnail: thumbUrl,
    author: req.body.author,
  });

  res.status(200).json({
    success: true,
    newVideo,
  });
});

// get a single video
exports.getVideo = asyncErrorHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new ErrorHandler('Video not found', 404));
  }

  res.status(200).json({
    success: true,
    video,
  });
});

// get related videos by title
exports.getRelatedVideos = asyncErrorHandler(async (req, res, next) => {
  console.log(req.params.id);
  console.log(req.query.title);
  const videos = await Video.find({ title: { $regex: req.query.title } });

  if (!videos) {
    return next(new ErrorHandler('No related videos found', 404));
  }

  res.status(200).json({
    success: true,
    videos,
  });
});

// search videos by title
exports.searchVideos = asyncErrorHandler(async (req, res, next) => {
  console.log(req.query.title);
  const videos = await Video.find({ title: { $regex: req.query.title } });

  if (!videos) {
    return next(new ErrorHandler('No videos found', 404));
  }

  res.status(200).json({
    success: true,
    videos,
  });
});
