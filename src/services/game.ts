import { Socket } from 'socket.io'

export function handleConnection(socket: Socket) {
    console.log('New connection', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
}