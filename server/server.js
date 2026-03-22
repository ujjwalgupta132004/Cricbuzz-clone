const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "cricbuzz clone server is running..." });
});



const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db.js");

connectDB();

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});