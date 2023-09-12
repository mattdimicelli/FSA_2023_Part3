const mongoose = require('mongoose');
require('dotenv').config();

const url = `mongodb+srv://matthewdimicelli:${process.env.PW}@cluster0.lrxnunn.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.set('strictQuery',false);
mongoose.connect(url).then(() => {
    console.log('connected to MongoDB');
}).catch(e => {
    console.log('Error connecting to Mongodb', e);
});
const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    number: {
        type: String,
        required: true,
    }
});
entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Entry = mongoose.model('Entry', entrySchema);
module.exports = Entry;