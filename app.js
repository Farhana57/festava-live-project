require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// স্ট্যাটিক ফাইল (HTML, CSS, Images) সার্ভ করার জন্য
app.use(express.static(path.join(__dirname)));

// --- 2. MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected: " + mongoose.connection.name))
    .catch(err => console.error("❌ DB Connection Error:", err));

// --- 3. SCHEMAS & MODELS ---
const ticketSchema = new mongoose.Schema({
    bookingId: { type: String, unique: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    ticketType: { type: String, default: 'Standard' },
    quantity: { type: Number, default: 1 },
    message: String,
    status: { type: String, default: 'Confirmed' },
    date: { type: Date, default: Date.now }
});
const TicketOrder = mongoose.model('TicketOrder', ticketSchema);

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: String,
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// --- 4. ROUTES ---
// হোম পেজে ভিজিট করলে index.html দেখানোর রাউট
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/tickets/book', async (req, res) => {
    try {
        const uniqueId = "FEST-" + Math.floor(100000 + Math.random() * 900000);
        const newOrder = new TicketOrder({ ...req.body, bookingId: uniqueId });
        await newOrder.save();
        res.status(201).json({ success: true, message: "Booking successful!", bookingId: uniqueId });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (err) {
        console.error("Contact Error:", err);
        res.status(500).json({ success: false, error: "Failed to send message" });
    }
});

app.get('/api/admin/tickets', async (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== "festava123") return res.status(401).json({ error: "Access Denied!" });
    try {
        const tickets = await TicketOrder.find().sort({ date: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// --- 5. SERVER START & EXPORT ---
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Festava Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;