import { Server, Socket } from 'socket.io'
import { SessionUser } from '../models/User';

interface QueueUser extends SessionUser {
    socket: Socket;
    ready: boolean;
    points: number;
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
            points: 0,
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
            io.emit('queue', usersInQueue);
        }
        if (usersInQueue.every(u => u.ready)) {
            gameStarted = true;
            io.emit('game-start', usersInQueue);
            usersInQueue.forEach(u => u.ready = false);
            io.emit('queue', usersInQueue);
            var counter = 10;
            console.log('Game started');
            
            io.sockets.emit('counter', counter);
            var countdown = setInterval(() => {
                counter--
                io.sockets.emit('counter', counter);
                console.log(counter);
                if (counter === 0) {
                    io.emit('game-end', usersInQueue);
                    clearInterval(countdown);
                    gameStarted = false;
                }
            }, 1000);
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