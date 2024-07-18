import { Server } from "socket.io";
import { GameController } from "../controllers/game.controller";

export const setupSocketServer = (httpServer: any) => {
    const io = new Server(httpServer, {
        path: '/socket/game',
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });

    const gameController = new GameController();

    io.on('connection', (socket) => {
        console.log('a user connected');

        gameController.registerHandlers(io, socket);
        
        GameController.emitRadarUpdates(socket)

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    return io;
};