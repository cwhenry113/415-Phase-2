const express = require('express');
const app = express();
const router = express.Router();

const { Client } = require('pg');
const client = new Client({
    host: 'dpg-ch1vpb5269v61fb0k1pg-a',
    port: 5334,
    database: 'db415',
    user: 'carter',
    password: 'DqOgzzFfsBwpj6SKEId73vQJ2luPzwhA',
});
client.connect();

//Create the tickets table if it does not already exist
client.query('CREATE TABLE IF NOT EXISTS tickets (id serial PRIMARY KEY, type VARCHAR(20), subject VARCHAR(64), description VARCHAR(255), status VARCHAR(6))', (err, res) => {
    console.log(res)
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', router);

app.listen(3000);
console.log("Server started");

//Find and display all tickets
router.get('/rest/list', function (req, res) {
    let reply
    let text = 'SELECT * FROM tickets'
    client.query(text, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0])
            reply = res.rows[0]
        }
    })
    res.send(reply)
});

//Find and display a ticket with given id
router.get('/rest/ticket/id', function (req, res) {
    let reply
    let text = 'SELECT * FROM tickets WHERE id=$1'
    let values = [req.body.id]
    client.query(text, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0])
            reply = res.rows[0]
        }
    })
    res.send(reply)
});

//Create a new ticket
router.post('/rest/ticket', function (req, res) {
    let reply
    let text = 'INSERT INTO tickets(type, subject, description, status) VALUES($1, $2, $3, $4, $5) RETURNING id'
    let values = [req.body.type, req.body.subject, req.body.description, req.body.status]
    client.query(text, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0])
            reply = res.rows[0]
        }
    })
    res.send(reply)
});

//Delete a ticket
router.delete('/rest/ticket/id', function (req, res) {
    let reply
    const text = 'DELETE FROM tickets WHERE id=$1'
    const values = [req.body.id]
    client.query(text, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0])
            reply = res.rows[0]
        }
    })
    res.send(reply)
});

//Update a ticket
router.put('/rest/ticket/id', function (req, res) {
    let reply
    const text = 'UPDATE tickets SET type=$1, subject=$2, description=$3, status=$4 WHERE id=$5'
    const values = [req.body.type, req.body.subject, req.body.description, req.body.status, req.body.id]
    client.query(text, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log(res.rows[0])
            reply = res.rows[0]
        }
    })
    res.send(reply)
});