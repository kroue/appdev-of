const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Use nodemailer for Node.js, PHPMailer for PHP

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'onlyfriends'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { fullName, gender, age, phoneNumber, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (full_name, gender, age, phone_number, email, password_hash) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [fullName, gender, age, phoneNumber, email, passwordHash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email or phone number already exists.' });
                }
                throw err;
            }
            res.status(201).json({ message: 'User registered successfully.' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Login successful.', user: { id: user.id, fullName: user.full_name, email: user.email } });
    });
});

// CRUD for users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/users', (req, res) => {
    const { fullName, email, gender, age, phoneNumber, password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    db.query(
        'INSERT INTO users (full_name, email, gender, age, phone_number, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
        [fullName, email, gender, age, phoneNumber, passwordHash],
        (err) => {
            if (err) throw err;
            res.status(201).json({ message: 'User added successfully.' });
        }
    );
});

app.delete('/api/users/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: 'User deleted successfully.' });
    });
});

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching user.' });
        if (results.length === 0) return res.status(404).json({ message: 'User not found.' });
        res.json(results[0]);
    });
});

// CRUD for schedules
app.get('/api/schedules', (req, res) => {
    db.query('SELECT * FROM schedules', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/schedules', (req, res) => {
    const { date, time } = req.body;
    db.query('INSERT INTO schedules (date, time) VALUES (?, ?)', [date, time], (err) => {
        if (err) throw err;
        res.status(201).json({ message: 'Schedule added successfully.' });
    });
});

app.delete('/api/schedules/:id', (req, res) => {
    db.query('DELETE FROM schedules WHERE id = ?', [req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: 'Schedule deleted successfully.' });
    });
});

// Logs
app.get('/api/logs', (req, res) => {
    const { userId } = req.query;
    const query = userId
        ? 'SELECT logs.*, users.full_name AS user_full_name FROM logs JOIN users ON logs.user_id = users.id WHERE user_id = ?'
        : 'SELECT logs.*, users.full_name AS user_full_name FROM logs JOIN users ON logs.user_id = users.id';
    const params = userId ? [userId] : [];
    db.query(query, params, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/logs', (req, res) => {
    const { userId, type, time } = req.body;
    const timestamp = time || new Date().toISOString(); // Use provided time or fallback to current UTC time
    db.query('INSERT INTO logs (user_id, type, time) VALUES (?, ?, ?)', [userId, type, timestamp], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to record log.' });
        }
        res.status(201).json({ message: 'Log recorded successfully.' });
    });
});

// Store codes in-memory for demo (use DB in production)
const resetCodes = {};

// Send reset code endpoint
app.post('/api/send-reset-code', (req, res) => {
    const { email } = req.body;
    console.log('Received email:', email); // Debugging log

    // Check if the email exists in the database
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log database error
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length === 0) {
            console.log('Email not found:', email); // Log if email is not found
            return res.status(404).json({ message: 'Email not found.' });
        }

        console.log('Email found, sending code...'); // Log if email is found

        // Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Send the email using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kroue4444@gmail.com',
                pass: 'dcdi avmy kgye uaeu', // Ensure this is correct
            }
        });

        const mailOptions = {
            from: 'kroue4444@gmail.com',
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${code}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error); // This will print the real reason
                return res.status(500).json({ message: 'Failed to send email.' });
            }
            console.log('Email sent:', info.response);
            res.json({ message: 'Code sent to email.', code });
        });
    });
});

// Reset password endpoint
app.post('/api/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    // Validate code in production!
    const passwordHash = bcrypt.hashSync(newPassword, 10);
    db.query('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Failed to update password.' });
        res.json({ message: 'Password updated.' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});