const mongoose = require('mongoose')

const payinSchema = mongoose.Schema({
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
    request_payin: {
     type: String
        
    },
    date_string :{
        type : String
    },

    date:{
        type : Number
    },
    attended_by : {
        type : Number
    },
    payment_method : {
        type: String
    },
    payment_reference : {
        type : String
    },
    amount : {
        type : Number
    },
 
    
    u_id: {
        type: String,
        required: true,
        ref: 'User'
    },
  
    
    
})




const Payin = mongoose.model('Payin',payinSchema )

module.exports = Payin