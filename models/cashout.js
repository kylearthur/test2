const mongoose = require('mongoose')

const Coinsout = mongoose.model('Coinsout', {
    // name: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    
    // email: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     lowercase: true
    // },
    amount: {
        type: Number
        
    },
    u_date_cashout:{
        type: Number
       // default: new Date()
    },

    u_date_cashout_string:{
        type: String
       // default: new Date()
    },
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
       },

     via:{
            type: String
        },

    date_attended: {
            type: Number
        },

    date_attended_string : {
            type: String
        }  
})

module.exports = Coinsout