// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js'; // Mongoose model for Order

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB Atlas using the connection string from .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// POST route to create an order
app.post('/api/order', async (req, res) => {
  try {
    const { mobile, totalPrice, slices, quantity } = req.body;
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const nextOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber.split('-')[1]) + 1 : 1;

    const order = new Order({
      mobile,
      totalPrice,
      slices,
      quantity,
      orderNumber: `BURG-${String(nextOrderNumber).padStart(3, '0')}`,
    });

    await order.save();
    res.status(201).send({ orderNumber: order.orderNumber });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).send({ message: 'Error saving order', error });
  }
});

// GET route to fetch the next order number
app.get('/api/order/next', async (req, res) => {
  try {
    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const nextOrderNumber = lastOrder ? parseInt(lastOrder.orderNumber.split('-')[1]) + 1 : 1;

    res.send({ nextOrderNumber: `BURG-${String(nextOrderNumber).padStart(3, '0')}` });
  } catch (error) {
    res.status(500).send('Error fetching next order number');
  }
});

// Start the server on the port defined in the .env file or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
