const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory user storage (use a database in a real application)
const users = [];

// User signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.send('User registered');
});

// User login (basic example)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        res.send('Login successful');
    } else {
        res.send('Invalid credentials');
    }
});
// Serve video files
app.get('/video/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = __dirname + '/public/videos/' + filename;
    res.sendFile(filepath);
});

// Serve the dashboard (example)
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
});
// Mock API endpoint to get courses
app.get('/api/courses', (req, res) => {
    const courses = [
        { name: 'Course 1', video: 'course1.mp4' },
        { name: 'Course 2', video: 'course2.mp4' }
    ];
    res.json(courses);
});
// In-memory forum storage (use a database in a real application)
const forumPosts = [];

// Get all forum posts
app.get('/api/forum', (req, res) => {
    res.json(forumPosts);
});

// Add a new forum post
app.post('/api/forum', (req, res) => {
    const { content } = req.body;
    const newPost = { content };
    forumPosts.push(newPost);
    res.json(newPost);
});


// Real-time chat functionality
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', ({ room, message }) => {
        io.to(room).emit('chat message', { room, message });
    });
    socket.on('join room', (room) => {
        socket.join(room);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
