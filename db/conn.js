const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose
        .connect('mongodb+srv://ehteshambutt58:4G9PFxLyIR6PqGLn@cluster0.mw68zmh.mongodb.net/number_discussion?retryWrites=true&w=majority',  {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        })
        .then(() => console.log('Connected Successfully'))
        .catch((err) => console.error('Not Connected',err));
}

module.exports = connectDB;

