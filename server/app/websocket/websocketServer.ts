import { Server } from "socket.io";
import { gameController } from "../controllers/game.controller";

export const setupSocketServer = (httpServer: any) => {
    const io = new Server(httpServer, {
        path: '/socket/game',
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        gameController.registerSocketHandlers(socket, io);
    });

    

    return io;
};