const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Task = require('./models/Task');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/TaskTracker", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB is Connected");
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Please enter correct email address" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = generateToken(user);
            res.status(200).json({ user, message: "Login successful", token });
        } else {
            res.status(400).json({ message: "Invalid Password Try Again" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/signup", async (req, res) => {
    const { fullName, phone, email, password } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            fullName,
            phone,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Server error" });
    }
});
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        return res.status(403).json({ message: 'Authorization token missing' });
    }
    
    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            } else {
                return res.status(403).json({ message: 'Invalid token' });
            }
        }
        req.user = user;  // Store user info for future use in the request
        next();
    });
};

app.get("/dashboard", authenticateJWT, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});

app.post('/addTask/:userId', async (req, res) => {
    const { userId } = req.params;
    const { title, description, dueDate, status } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            dueDate,
            status,
            user: userId
        });

        await newTask.save();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.tasks.push(newTask._id);
        await user.save();

        res.status(201).json({ message: 'Task added successfully!', task: newTask });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/updateTask/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;
    const { title, description, dueDate, status } = req.body;

    try {
        const task = await Task.findOne({ _id: taskId, user: userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or does not belong to this user' });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;

        await task.save();
        
        res.status(200).json({ message: 'Task updated successfully!', task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
