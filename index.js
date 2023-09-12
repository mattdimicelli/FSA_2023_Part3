const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Entry = require('./models/Entry');
const app = express();


app.use(cors());
app.use(express.static('dist'));
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


app.get('/api/persons', (req, res, next) => {
    Entry.find({}).then(entries => {
        res.json(entries);
    }).catch(e => next(e));
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Entry.findById(id).then(match => {
        if(match === null) {
            res.status(404).end();
        } else {
            res.json(match);
        }
    }).catch(e => next(e));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Entry.findByIdAndDelete(id).then(() => {
        res.status(204).end();
    }).catch(e => next(e));
});

app.post('/api/persons', (req, res, next) => {
    const {name, number} = req.body;
    const entry = {name, number};
    if (name == null || number == null || name === '' || number === '') {
        return res.status(400).json({error: 'Must give name and number'});
    }
    Entry.find({ name: name }).then(nameMatches => {
        if(nameMatches.length > 0) {
            res.status(400).json({ error: 'Name must be unique' });
        } else {
            const entryDoc = new Entry(entry);
            entryDoc.save().then(savedEntry => {
                console.log('entry saved to db');
                res.json(savedEntry);
            }).catch(e => next(e));
        }
    }).catch(e => next(e));
});

app.put('/api/persons/:id', (req, res, next) => {
    const entry = req.body;
    const id = req.params.id;
    Entry.findByIdAndUpdate(id, entry, { new: true, runValidators: true })
        .then(updatedEntry => res.json(updatedEntry))
        .catch(e => next(e));
});

app.get('/info', (req, res, next) => {
    Entry.find({}).then(response => {
        res.send(`<p>There are ${response.length} people in the phone book</p><p>${new Date()}</p>`);
    }).catch(e => next(e));
});

app.use((error, req, res, next) => {
    if (error.name === 'CastError') {
        console.error(error);
        return res.status(400).json({ error: 'malformatted id'}).end();
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    console.error(error);
    next();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})