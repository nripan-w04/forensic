const socketIo = require('socket.io');

let io;

module.exports = {
    init: (server) => {
        io = socketIo(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket) => {
            console.log('New Client Connected: ' + socket.id);
            
            socket.on('join_case', (caseId) => {
                socket.join(caseId);
                console.log(`Client ${socket.id} joined case room: ${caseId}`);
            });

            socket.on('disconnect', () => {
                console.log('Client Disconnected');
            });
        });

        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
