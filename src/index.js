const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const port = process.env.PORT || 4000;
const helmet = require('helmet');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const viewEngine = require('./configs/viewEngine');
const routes = require('./routes');
const connectDB = require('./configs/connect.db');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
viewEngine(app);
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
connectDB();
routes(app);
let users = [];
function User(username, email, phone) {
    this.username = username;
    this.email = email;
    this.phone = phone;
}
io.on('connection', (socket) => {
    console.log('User connected');
    console.log(socket.id);
    socket.on('register', (user) => {
        const newUser = new User(user.username, user.email, user.phone);
        const data = users.filter((user) => user.email === newUser.email);
        if (data.length) {
            socket.emit('register-failure');
            return;
        }
        users.push(newUser);
        socket.username = newUser.username;
        socket.emit('register-sucess', newUser);
        io.sockets.emit('send-users', users);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user_disconnected', socket.username);
        console.log('User disconnected');
        users.pop();
        io.sockets.emit('send-users', users);
    });
});
server.listen(port, () =>
    console.log(`Server listening on http://localhost:${port}`),
);
