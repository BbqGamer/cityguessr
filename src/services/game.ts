import { Socket } from 'socket.io'

export function handleConnection(socket: Socket) {
    const req: any = socket.request
    const session = req.session
    if (!session.user) {
        console.log('connection from unknown user dropping');
        socket.disconnect();
    } else {
        console.log('Connection from user: ', session.user.username);
    }

    socket.on('disconnect', () => {
        console.log('User disconnected user: ', session.user.username);
    });
}