import { Server, Socket } from 'socket.io'
import { SessionUser } from '../models/User';

let usersInQueue: SessionUser[] = [];

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
        usersInQueue.push(session.user);

        io.emit('queue', usersInQueue);
    }

    socket.on('disconnect', () => {
        console.log('User disconnected user: ', session.user.username);
        usersInQueue = usersInQueue.filter(u => u.user_id !== session.user.user_id);
        io.emit('queue', usersInQueue);
    });
}