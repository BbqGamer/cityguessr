import { Server, Socket } from 'socket.io'
import { SessionUser } from '../models/User';

interface QueueUser extends SessionUser {
    socket: Socket;
    ready: boolean;
}

let usersInQueue: QueueUser[] = [];
let gameStarted = false;

export function handleConnection(io: Server, socket: Socket) {
    const req: any = socket.request
    const session = req.session
    if (!session.user) {
        console.log('connection from unknown user dropping');
        socket.disconnect();
    } else {
        if (!session.user.activated) {
            console.log('connection from unactivated user dropping');
            return socket.disconnect();
        }
        console.log('Connection from user: ', session.user.username);
        if (usersInQueue.find(u => u.user_id === session.user.user_id)) {
            console.log('User already in queue dropping');
            socket.emit('drop', 'You are already in the queue')
            return socket.disconnect();
        }
        const user: QueueUser = {
            ...session.user,
            socket: socket,
            ready: false,
        }
        usersInQueue.push(session.user);

        io.emit('queue', usersInQueue);
    }

    socket.on('ready', () => {
        const user = usersInQueue.find(u => u.user_id === session.user.user_id);
        if (gameStarted) {
            socket.emit('drop', 'Game already started');
            return socket.disconnect();
        }
        if (user) {
            user.ready = true;
            console.log(usersInQueue)
            io.emit('queue', usersInQueue);
        }
        if (usersInQueue.length >= 2 && usersInQueue.every(u => u.ready)) {
            gameStarted = true;
            io.emit('game-start', usersInQueue);
        }
    });

    socket.on('unready', () => {
        if (gameStarted) {
            socket.emit('drop', 'Game already started');
            return socket.disconnect();
        }
        const user = usersInQueue.find(u => u.user_id === session.user.user_id);
        if (user) {
            user.ready = false;
            console.log(usersInQueue)
            io.emit('queue', usersInQueue);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected user: ', session.user.username);
        usersInQueue = usersInQueue.filter(u => u.user_id !== session.user.user_id);
        io.emit('queue', usersInQueue);
    });


}