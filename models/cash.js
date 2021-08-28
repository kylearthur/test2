const mongoose = require('mongoose')

const Coins = mongoose.model('Coins', {
    amount: {
        type: Number,
        required: true,
        default: 0
    },
   
    
    u_id: {
        unique: true,
        type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true,
        ref: 'User'
    }
})

module.exports = Coins