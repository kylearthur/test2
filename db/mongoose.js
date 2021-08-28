const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:127.0.0.1:27017/testingko7', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})