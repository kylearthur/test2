const mongoose = require('mongoose')

const User_profileSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        lowercase: true
    },
    date_of_birth: {
        type: String,
        required: true,
        lowercase: true
    },
nationality: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    current_address: {
        type: String,
        required: true,
        lowercase: true
    },
    occupation: {
        type: String,
        required: true,
        lowercase: true
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




const User_profile = mongoose.model('User_profile',User_profileSchema )

module.exports = User_profile