const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const { Client } = require('pg');
const convert = require('xml-js');
require('body-parser-xml')(bodyParser);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.listen(3000);
console.log("Server started");

const creds = {
    host: 'dpg-ch1vpb5269v61fb0k1pg-a.oregon-postgres.render.com',
    port: 5432,
    database: 'db415',
    user: 'carter',
    password: 'DqOgzzFfsBwpj6SKEId73vQJ2luPzwhA',
    ssl: true
}

let text
let values

async function clientGetOne() {
    console.log("Start of getOne")
    const client = new Client(creds);
    await client.connect();
    const now = await client.query(text, values);
    await client.end();
    console.log(now.rows)
    return (now.rows);
}

//Find and display all tickets
router.get('/rest/list', async function (req, res) {
    text = 'SELECT * FROM tickets'
    values = []
    res.send(await clientGetOne())
});

//Find and display a ticket with given id
router.get('/rest/ticket/id', async function (req, res) {
    text = 'SELECT * FROM tickets WHERE id=$1'
    values = [req.body.id]
    res.send(await clientGetOne())
});

//Adapts JSON output to XML for the GET rest/ticket/id route
router.get('/rest/xml/ticket/id', async function (req, res) {
    text = 'SELECT * FROM tickets WHERE id=$1'
    values = [req.body.id]
    const toAdapt = await clientGetOne()
    res.send(convert.json2xml(toAdapt, {compact: true, spaces: 4}))
});

//Create a new ticket
router.post('/rest/ticket', async function (req, res) {
    text = 'INSERT INTO tickets(type, subject, description, status) VALUES($1, $2, $3, $4) RETURNING id'
    values = [req.body.type, req.body.subject, req.body.description, req.body.status]
    res.send(await clientGetOne())
});

//Delete a ticket
router.delete('/rest/ticket/id', async function (req, res) {
    text = 'DELETE FROM tickets WHERE id=$1'
    values = [req.body.id]
    res.send(await clientGetOne())
});

//Update a ticket
router.put('/rest/ticket/id', async function (req, res) {
    text = 'UPDATE tickets SET type=$1, subject=$2, description=$3, status=$4 WHERE id=$5'
    values = [req.body.type, req.body.subject, req.body.description, req.body.status, req.body.id]
    res.send(await clientGetOne())
});

//Adapts XML input to JSON for the PUT rest/ticket/id route
router.put('/rest/xml/ticket/id', bodyParser.xml(), async function (req, res) {
    text = 'UPDATE tickets SET type=$1, subject=$2, description=$3, status=$4 WHERE id=$5'
    values = [req.body.root.type[0], req.body.root.subject[0], req.body.root.description[0], req.body.root.status[0], req.body.root.id[0]]
    res.send(await clientGetOne())
});