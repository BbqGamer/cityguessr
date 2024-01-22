import { Server, Socket } from 'socket.io'
import { SessionUser } from '../models/User';
import { GPTDescribeCity } from './openai';
import { getRandomCity } from './cityRetrieval';


interface QueueUser extends SessionUser {
    ready: boolean;
    points: number;
    guess: string;
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
            ready: false,
            points: 0,
            guess: ""
        }
        console.log(user)
        usersInQueue.push(user);

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
            usersInQueue.forEach(u => u.guess = "");
            io.emit('queue', usersInQueue);
            var counter = 30;
            console.log('Game started');
            
            // random city
            getRandomCity("European cities", (err: any, res) => {
                if (err) { return console.log(err); }
                if (!res) { return console.log('No city found'); }
                
                const city = res[0];
                const candidates = res[1];
                io.emit('candidates', candidates);
                console.log('City: ', city.name, 'was chosen randomly')
                GPTDescribeCity(city).then(description => {
                    if (!description) {
                        console.log('No description found');
                        return io.emit('city', 'No description found');
                    }
                    io.emit('city', description);

                    io.sockets.emit('counter', counter);
                    var countdown = setInterval(() => {
                        counter--
                        io.sockets.emit('counter', counter);
                        console.log(counter);
                        if (counter === 0) {
                            io.emit('game-end', city);
                            clearInterval(countdown);
                            gameStarted = false;
                        }
                    }, 1000);
                });
            })
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