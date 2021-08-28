const mongoose = require('mongoose')

const payoutSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    // request_payout: {
    //  type: String
        
    // },
    date_string :{
        type : String
    },

    date :{
        type : Number
    },
    attended_by : {
        type : Number
    },
    amount : {
        type : Number
    },
 
    
    u_id: {
        type: String,
        required: true,
        
    },
  
    
    
})




const Payout = mongoose.model('Payout',payoutSchema )

module.exports = Payout