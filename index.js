const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan((tokens, req, res) => {
    const body = req.body;
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(body),
    ].join(' ')
}));

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
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    const id = Math.round(Math.random() * 100000000);
    const entry = { name, number, id };
    const nameMatch = entries.find(entry => entry.name === name);
    if (name == null || number == null || name === '' || number === '') {
        res.status(400).json({ error: 'Must give name and number' });
    } else if (nameMatch) {
        res.status(400).json({ error: 'Name must be unique' });
    } else {
        entries.push(entry);
        res.json(entry);
    }
});

app.get('/info', (req, res) => {
    res.send(`<p>There are ${entries.length} people in the phone book</p><p>${new Date()}</p>`);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('server is running');
})