const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hungnt:hwng.nt1608@cluster0.mrpik.mongodb.net/test',
    { useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true },
);

const accSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }},
    {
        collection: 'account'
})

module.exports = mongoose.model('account', accSchema);