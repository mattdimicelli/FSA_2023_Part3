const mongoose = require('mongoose');
require('dotenv').config();

const url = `mongodb+srv://matthewdimicelli:${process.env.PW}@cluster0.lrxnunn.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.set('strictQuery',false);
mongoose.connect(url).then(res => {
    console.log('connected to MongoDB');
}).catch(e => {
    console.log('Error connecting to Mongodb', e);
});
const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
});
const Entry = mongoose.model('Entry', entrySchema);
module.exports = Entry;