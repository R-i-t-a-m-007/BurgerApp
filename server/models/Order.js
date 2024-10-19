// models/Order.js
import mongoose from 'mongoose';

const sliceSchema = new mongoose.Schema({
    type: { type: String, required: true },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    mobile: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    slices: [sliceSchema],
    quantity: { type: Number, required: true },
    orderNumber: { type: String, required: true },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
