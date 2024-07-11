// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const itemRoutes = require('./routes/itemRoutes');

// const app = express();
// const port = process.env.PORT || 4000;

// app.use(bodyParser.json());
// app.use(cors());

// const encodedPassword = encodeURIComponent('crudmernawslambda1@');
// const mongoURI = `mongodb+srv://CRUD-MERN-AWSLAMBDA:${encodedPassword}@crud-mern-awslambda.wgemtnv.mongodb.net/?retryWrites=true&w=majority&appName=CRUD-MERN-AWSLAMBDA`; // Replace with your actual MongoDB URI

// mongoose.connect(mongoURI);

// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
// });

// app.use('/items', itemRoutes);

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Item = require('./models/item');
const authenticateToken = require('./middlewares/auth');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const encodedPassword = encodeURIComponent('crudmernawslambda1@');
const mongoURI = `mongodb+srv://CRUD-MERN-AWSLAMBDA:${encodedPassword}@crud-mern-awslambda.wgemtnv.mongodb.net/?retryWrites=true&w=majority&appName=CRUD-MERN-AWSLAMBDA`; // Replace with your actual MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, {
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
  
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

