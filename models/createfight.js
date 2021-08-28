const mongoose = require('mongoose')

const fightSchema = mongoose.Schema({
    fight_number: {
        type: Number,
        required: true
       
    },
    winner: {
        type: String
    },
    winner_name: {
        type: String,
        default: "none"
    },
    status: {
        type: String,
        default: "pending"
    },
    
    match: {
        type: String,
        required: true
    },
 
    date_string :{
        type : String
    },

    date :{
        type : Number
    },
    u_id: {
        type: String,
      
        ref: 'User'
    }, 
})




const Fight = mongoose.model('Fight',fightSchema )

module.exports = Fight