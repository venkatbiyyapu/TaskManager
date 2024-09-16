const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Task = require('./models/Task');
const { ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/TaskTracker", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));


const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const authenticateJWT = (req, res, next) => {
    console.log("Authenticating");
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log("error occurred");
        return res.status(403).json({ message: 'Authorization token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
            return res.status(401).json({ message });
        }
        req.user = user; 
        next();
    });
};

app.get('/dashboard', authenticateJWT, (req, res) => {
    // You could optionally handle some cleanup here, like token invalidation (if using token blacklisting)
    return res.status(200).json({ message: 'User logged out successfully' });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = generateToken(user);
            return res.status(200).json({ user, message: "Login successful", token });
        } else {
            return res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

app.post("/signup", async (req, res) => {
    const { fullName, phone, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, phone, email, password: hashedPassword });

        await newUser.save();
        return res.status(201).json({ message: "User created successfully. Please Login!" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Server error" });
    }
});

app.get('/getTasks/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('tasks');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ tasks: user.tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/getUserDetails/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ user});
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/addTask/:userId', authenticateJWT, async (req, res) => {
    const { userId } = req.params;
    const { title, description, dueDate, status , priority } = req.body;
    // console.log( title, description, dueDate, status , priority );

    try {
        const newTask = new Task({ title, description, dueDate, status, priority });
        await newTask.save();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.tasks.push(newTask._id);
        await user.save();

        res.status(201).json({ message: 'Task added successfully', task: newTask });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.put('/editTask/:taskId', authenticateJWT, async (req, res) => {
    const { taskId } = req.params;
    const { title, description, dueDate, status, priority } = req.body;

    try {
        const task = await Task.findById(taskId);
        console.log(task)
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;
        if (priority) task.priority = priority;

        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.delete('/deleteTask/:taskId', authenticateJWT, async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        await User.updateMany({}, { $pull: { tasks: taskId } });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/validateToken', authenticateJWT, (req, res) => {
    console.log("validating");
    res.status(200).json({ message: 'Token is valid'});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


