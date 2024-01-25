import { Server, Socket } from 'socket.io'
import { SessionUser } from '../models/User';
import { GPTDescribeCity } from './openai';
import { getRandomCity } from './cityRetrieval';
import { closestCities } from './chroma/collection';
import { City, CityModel } from '../models/City';
import { gameSettings } from '../app';


interface QueueUser extends SessionUser {
    ready: boolean;
    points: number;
    guess: number;
    guessed: string;
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
            guess: -1,
            guessed: ""
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
            usersInQueue.forEach(u => u.guess = -1);
            usersInQueue.forEach(u => u.guessed = "");
            io.emit('queue', usersInQueue);
            var counter = gameSettings.countdown;
            console.log('Game started');
            
            // random city
            getRandomCity(gameSettings.cityQuery, gameSettings.cityQuerySize, (err: any, res) => {
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
                        if (counter === 0 || usersInQueue.every(u => u.guess !== -1)) {
                            clearInterval(countdown);
                            // round end
                            closestCities(description, 5).then(res => {
                                err = res[0];
                                const closest = res[1];
                                var close: number[];
                                if (err || !closest) { close = []; } else { close = closest; }
                                close = close.filter(c => c !== city.id);
                                CityModel.getAll(0, 1000, (err, allCities) => {
                                    if (err) { return console.log(err); }
                                    var citiesAll: City[];
                                    if (!allCities) { citiesAll = []; } else { citiesAll = allCities; }
                                    const closeCities = closest.map(id => citiesAll.find(c => c.id === id)); 
                                    io.emit('game-end', city, closeCities);
                                    for (let i = 0; i < usersInQueue.length; i++) {
                                        const user = usersInQueue[i];
                                        console.log("User guessed: ", user.guess, ", Correct answer: ", city.id)
                                        if (user.guess === city.id) {
                                            user.points += 3;
                                        } else if (close.includes(user.guess)) {
                                            console.log("Close cities", closeCities)
                                            user.points += 1;
                                        }
                                    }
                                    gameStarted = false;
                                    for (let i = 0; i < usersInQueue.length; i++) {
                                        usersInQueue[i].guessed = citiesAll.find(c => c.id === usersInQueue[i].guess)?.name || "";
                                        usersInQueue[i].guess = -1;
                                    }
                                    io.emit('queue', usersInQueue);
                                })
                            })
                        }
                    }, 1000);
                });
            })
        }
    });

    socket.on('choice', (choice: number) => {
        const user = usersInQueue.find(u => u.user_id === session.user.user_id);
        if (user) {
            user.guess = Number(choice);
        }
        console.log("Choice made: ", usersInQueue)
        io.emit('queue', usersInQueue);
    })

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