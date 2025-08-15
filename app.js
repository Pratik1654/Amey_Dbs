const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Setup MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '13sayee79',  // replace with your database password
    database: 'A_Engineers'  // replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (e.g., CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Index route to show menu
app.get('/', (req, res) => {
    res.render('index');
});

// Equipment table route
app.get('/equipment', (req, res) => {
    db.query('SELECT * FROM Equipment', (err, results) => {
        if (err) throw err;
        res.render('equipment', { equipment: results });
    });
});

// Employee table route
app.get('/employee', (req, res) => {
    db.query('SELECT * FROM Employee', (err, results) => {
        if (err) throw err;
        res.render('employee', { employees: results });
    });
});

// Add equipment
app.post('/add-equipment', (req, res) => {
    const { model_id, company_name, boom_length, date_of_manufacturing } = req.body;
    const query = 'INSERT INTO Equipment (model_id, company_name, boom_length, date_of_manufacturing) VALUES (?, ?, ?, ?)';
    db.query(query, [model_id, company_name, boom_length, date_of_manufacturing], (err) => {
        if (err) throw err;
        res.redirect('/equipment');
    });
});

// Add employee
app.post('/add-employee', (req, res) => {
    const { employee_id, employee_name, salary, contractor_id } = req.body;
    const query = 'INSERT INTO Employee (employee_id, employee_name, salary, contractor_id) VALUES (?, ?, ?, ?)';
    db.query(query, [employee_id, employee_name, salary, contractor_id], (err) => {
        if (err) throw err;
        res.redirect('/employee');
    });
});

// Edit equipment
app.post('/edit-equipment/:id', (req, res) => {
    const { id } = req.params;
    const { company_name, boom_length, date_of_manufacturing } = req.body;
    const query = 'UPDATE Equipment SET company_name = ?, boom_length = ?, date_of_manufacturing = ? WHERE model_id = ?';
    db.query(query, [company_name, boom_length, date_of_manufacturing, id], (err) => {
        if (err) throw err;
        res.redirect('/equipment');
    });
});

// Edit employee
app.post('/edit-employee/:id', (req, res) => {
    const { id } = req.params;
    const { employee_name, salary, contractor_id } = req.body;
    const query = 'UPDATE Employee SET employee_name = ?, salary = ?, contractor_id = ? WHERE employee_id = ?';
    db.query(query, [employee_name, salary, contractor_id, id], (err) => {
        if (err) throw err;
        res.redirect('/employee');
    });
});

// Delete equipment
app.post('/delete-equipment/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Equipment WHERE model_id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/equipment');
    });
});

// Delete employee
app.post('/delete-employee/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Employee WHERE employee_id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/employee');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});