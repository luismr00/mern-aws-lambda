const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Item = require('./models/item');
const Video = require('./models/video');
const authenticateToken = require('./middlewares/auth');
const AWS = require('aws-sdk');
require('dotenv').config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB / Make sure to add the mongodb connection string to your .env file
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Public route (no authentication)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Secured routes (authentication required)
app.use('/items', authenticateToken);

// CRUD operations for items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.name = req.body.name;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// app.delete('/items/:id', async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id);
//     if (!item) {
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     await item.remove();
//     res.json({ message: 'Item deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.delete('/items/:id', async (req, res) => {
    try {
      console.log(`Attempting to delete item with ID: ${req.params.id}`); // Log the ID being deleted
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      await item.deleteOne(); // Use deleteOne
      res.json({ message: 'Item deleted' });
    } catch (err) {
      console.error('Error during item deletion:', err); // Log the error
      res.status(500).json({ message: err.message });
    }
  });

// app.post('/upload', upload.single('image'), (req, res) => {
//   if (req.file) {
//       res.json({ imageUrl: req.file.location });
//   } else {
//       res.status(400).json({ error: 'Failed to upload image' });
//   }
// });

const generatePresignedUrl = (bucketName, objectKey, expiresInSeconds) => {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: expiresInSeconds
  };

  return s3.getSignedUrl('getObject', params);
};

// const verifyUserGroup = async (token, requiredGroup) => {
//   const params = {
//     AccessToken: token
//   };

//   console.log('checking userData');

//   const userData = await cognito.getUser(params).promise();

//   console.log('checking groups');

//   const groups = userData.UserAttributes.find(attr => attr.Name === 'cognito:groups').Value.split(',');

//   console.log(''); // Add a new line for better readability
//   console.log('User groups:', groups);
//   console.log(''); // Add a new line for better readability

//   return groups.includes(requiredGroup);
// };

// const verifyUserGroup = async (token, requiredGroup) => {
//   const params = {
//     AccessToken: token
//   };

//   try {
//     console.log('Fetching user data...');
//     const userData = await cognito.getUser(params).promise();
//     console.log('User data fetched:', userData);

//     console.log('Extracting groups...');
//     const groupAttribute = userData.UserAttributes.find(attr => attr.Name === 'cognito:groups');

//     console.log('Checking if user is part of any group...');
//     console.log('Group attribute:', groupAttribute);
    
//     if (!groupAttribute) {
//       console.log('User is not part of any group');
//       return false;
//     }

//     const groups = groupAttribute.Value.split(',');
//     console.log('User groups:', groups);

//     return groups.includes(requiredGroup);
//   } catch (error) {
//     console.error('Error verifying user group:', error);
//     throw new Error('Failed to verify user group');
//   }
// };

const verifyUserGroup = async (token, requiredGroup) => {
  const getUserParams = {
    AccessToken: token
  };

  try {
    console.log('Fetching user data...');
    const userData = await cognito.getUser(getUserParams).promise();
    console.log('User data fetched:', userData);

    const username = userData.Username;

    const listGroupsParams = {
      UserPoolId: process.env.AWS_USER_POOL_ID, // replace with your User Pool ID
      Username: username
    };

    console.log('Fetching user groups...');
    const groupsData = await cognito.adminListGroupsForUser(listGroupsParams).promise();
    console.log('User groups data fetched:', groupsData);

    const groups = groupsData.Groups.map(group => group.GroupName);
    console.log('User groups:', groups);

    return groups.includes(requiredGroup);
  } catch (error) {
    console.error('Error verifying user group:', error);
    throw new Error('Failed to verify user group');
  }
};


app.get('/videos/:id', async (req, res) => {
  // try {
  //   const video = await Video.findById(req.params.id);
  //   if (!video) {
  //     return res.status(404).json({ message: 'Video not found' });
  //   }

  //   res.json(video);
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }

  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);
  const token = req.headers.authorization.split(' ')[1];

  try {
    const video = await Video.findById(objectId);
    const requiredGroup = video.accessType === 'subscriber' ? 'Subscriber' : 'Visitor';

    console.log(video);

    if (await verifyUserGroup(token, requiredGroup)) {
      const url = generatePresignedUrl('simple-mern-bucket', video.s3key, 60 * 3); // Add your bucket name to environment variables later
      res.json({ url });
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/generate-presigned-url', (req, res) => {
  // const params = {
  //     Bucket: process.env.AWS_BUCKET_NAME,
  //     Key: req.query.fileName,
  //     Expires: 60, // URL expiration time in seconds
  //     ContentType: req.query.fileType,
  // };

  const folderName = 'uploads'; // Specify your folder name here
  const fileName = `${folderName}/${req.query.fileName}`;

  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Expires: 60, // URL expiration time in seconds
      ContentType: req.query.fileType,
      // ACL: 'public-read' // Ensure the file is publicly readable
  };

  s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error generating presigned URL' });
          return;
      }
      res.json({ url });
  });
});  
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

