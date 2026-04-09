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

        socket.on('disconnect', (reason) => {
            if (reason === 'client namespace disconnect') {
                console.log(`ℹ️ Client closed socket: ${socket.id}`);
                return;
            }

            console.warn(`❌ Disconnected: ${socket.id} | Reason: ${reason}`);
        });

        socket.on('disconnecting', (reason) => {
            const rooms = [...socket.rooms].filter((room) => room !== socket.id);
            const log = reason === 'client namespace disconnect' ? console.log : console.warn;
            log(`⚠️ Disconnecting: ${socket.id} | Reason: ${reason} | Rooms: ${rooms.join(', ') || 'none'}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error('Socket.IO not initialized!');
    return io;
};

module.exports = { initSocket, getIO };
