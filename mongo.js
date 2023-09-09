const mongoose = require('mongoose');

if (process.argv.length === 2) {
    console.log('Must give mongodb password as argument');
    process.exit(1);
}
const [engine, entryPoint, pw, name, phoneNum] = process.argv;

const url = `mongodb+srv://matthewdimicelli:${pw}@cluster0.lrxnunn.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery',false);
mongoose.connect(url);

const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Entry = mongoose.model('Entry', entrySchema);

if (name != null && phoneNum != null & name != '' && phoneNum != '') {
    // add entry
    const entry = new Entry({
        name: name,
        number: phoneNum,
    });
    entry.save().then(res => {
        console.log('entry saved to db');
        mongoose.connection.close();
    });
} else {
    Entry.find({}).then(res => {
        res.forEach(entry => {
            console.log(entry);
        });
        mongoose.connection.close();
    });
}