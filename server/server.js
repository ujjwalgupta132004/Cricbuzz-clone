const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const http = require('http');
const { initSocket } = require('./config/socket');

const app = express();


const server = http.createServer(app);  
initSocket(server);  


app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "cricbuzz clone server is running..." });
});



const PORT = process.env.PORT || 5000;


const httpServer = http.createServer(app);
const io = initSocket(httpServer);


const connectDB = require("./config/db.js");

connectDB();

const authRoutes = require('./routes/authRoutes');
const cricketRoutes = require('./routes/cricketRoutes');
const footballRoutes = require('./routes/footballRoutes');
const tennisRoutes=require('./routes/tennisRoutes');
const playerRoutes = require('./routes/playerRoutes');
const predictionRoutes = require('./routes/predictionRoutes');




app.use('/api/auth', authRoutes);
app.use('/api/cricket', cricketRoutes);
app.use('/api/football', footballRoutes);
app.use('/api/tennis', tennisRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/predictions', predictionRoutes);


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});