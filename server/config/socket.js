const { Server } = require('socket.io');

let io;

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`⚡ Client connected: ${socket.id}`);

        socket.on('joinMatch', ({ sport, matchId }) => {
            const room = `${sport}_${matchId}`;
            socket.join(room);
            console.log(`👤 ${socket.id} joined room: ${room}`);
        });

        socket.on('leaveMatch', ({ sport, matchId }) => {
            socket.leave(`${sport}_${matchId}`);
        });

        socket.on('subscribeSport', (sport) => {
            socket.join(`sport_${sport}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error('Socket.IO not initialized!');
    return io;
};

module.exports = { initSocket, getIO };
