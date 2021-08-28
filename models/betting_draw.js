const mongoose = require('mongoose')

const Betting_draw = mongoose.model('Betting_draw', {
    amount: {
        type: Number,
    },
    fight_number: {
        type: Number,
        required: true
    },
    u_date_bet:{
        type: Number
       // default: new Date()
    },

    u_date_bet_string:{
        type: String
       // default: new Date()
    },

    
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fight_id: {
        type: String,
        required: true
       
    }
})

module.exports = Betting_draw