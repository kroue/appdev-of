const mysql = require('mysql'); // Import the mysql module
const express = require('express');
const cors = require('cors'); // To handle cross-origin requests
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'onlyfriends', // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Registration endpoint
app.post('/api/register', (req, res) => {
    const { fullName, gender, age, phoneNumber, email, password } = req.body;

    if (!fullName || !gender || !age || !phoneNumber || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'An error occurred while registering the user.' });
        }

        const query = 'INSERT INTO users (full_name, gender, age, phone_number, email, password_hash) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [fullName, gender, age, phoneNumber, email, hash], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err); // Log the error
                return res.status(500).json({ message: 'An error occurred while registering the user.' });
            }
            res.status(201).json({ message: 'User registered successfully.' });
        });
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'An error occurred while logging in.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Login successful.', user });
    });
});

app.post('/api/logs', (req, res) => {
    const { userId, type, time } = req.body;

    if (!userId || !type || !time) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO logs (user_id, type, time) VALUES (?, ?, ?)';
    db.query(query, [userId, type, time], (err, result) => {
        if (err) {
            console.error('Error inserting log:', err);
            return res.status(500).json({ message: 'An error occurred while logging the action.' });
        }
        res.status(201).json({ message: 'Log recorded successfully.' });
    });
});  

app.get('/api/schedules', (req, res) => {
    db.query('SELECT * FROM schedules', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/api/logs', (req, res) => {
    const { userId } = req.query;
    const query = 'SELECT * FROM logs WHERE user_id = ? ORDER BY time DESC';
    db.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Default route
app.get('/', (req, res) => {
    res.send('Server is running.');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});