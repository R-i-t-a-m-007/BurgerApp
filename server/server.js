// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Order from './models/Order.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
