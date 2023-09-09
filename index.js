const express = require('express');
const app = express();

let entries = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.json(entries);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const match = entries.find(entry => entry.id === Number(id));
    if (match === undefined) {
        res.status(404).end();
    } else {
        res.json(match);
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    entries = entries.filter(entry => entry.id !== Number(id));
    console.log(entries);
    res.status(204).end();
})

app.get('/info', (req, res) => {
    res.send(`<p>There are ${entries.length} people in the phone book</p><p>${new Date()}</p>`);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('server is running');
})