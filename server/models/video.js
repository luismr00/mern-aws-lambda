const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  s3key: { 
    type: String, 
    required: true 
  },
  accessType: {
    type: String,
    enum: ['visitor', 'subscriber'],
    required: true
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
