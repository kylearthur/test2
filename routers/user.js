const express = require('express')
const User = require('../models/user')
const User_level = require('../models/u_level')
// const multer = require('multer')
 // const sharp = require('sharp')
const bcrypt = require('bcryptjs')
const Coins = require('../models/cash')
const auth = require('../middleware/auth')
const { off } = require('../models/user')
const router = new express.Router()


router.post('/users', async (req, res) => {
    const body = req.body
    let ts = Math.round(Date.now() / 1000);

    const userInfo = {
        "email":body.email,
        "password":body.password,
        "mobile_number":body.mobile_number,
        "age":body.age,
        "u_date_registered": ts,
        "u_date_registered_string": new Date(ts * 1000)
    }
    const user = new User(userInfo)
    console.log(user)
    const coinsInfo = {
        u_id: user.id,
        coins: 0,
        "email":body.email
    }
    const coins = new Coins(coinsInfo)


    let my_master_agent_email = ''
    let my_agent_email = ''
    let u_level = ''
    let email = body.email
    console.log('body.type'+body.type)
   
    if(body.type === 'agent'){
     my_master_agent_email = body.extra_email
     my_agent_email = ''
     u_level = 'agent'
    } else if(body.type === 'player'){
        
        if(body.extra_email !== "null" ){
            console.log('body.extra_email'+body.extra_email)
                
                 const ma = await User_level.findOne({email : body.extra_email})
                  my_master_agent_email = ma.my_master_agent_email
                  my_agent_email = body.extra_email
                u_level = 'player'
            }else{
                console.log('body.extra_email'+body.extra_email)
                my_master_agent_email = 'isokraft@gmail.com'
                my_agent_email = 'contact@artpologabriel.com'
                u_level = 'player'
            }
    } else {
        console.log('body.extra_email'+body.extra_email)
                my_master_agent_email = 'isokraft@gmail.com'
                my_agent_email = 'contact@artpologabriel.com'
                u_level = 'player'
    }
    
    await user.save()
     
    let u_id = await User.findOne({email})

    const uzer_level = {
        my_master_agent_email,
        my_agent_email,
        email,
        u_level,
        u_id,
        "date": ts,
        "date_string": new Date(ts * 1000)
    }

    
   

    const user_level = new User_level(uzer_level)
    console.log('user_level'+user_level)

    try {
        
        // await user.save()
        await coins.save()
        await user_level.save()
        const token = await user.generateAuthToken()    
        let success_response = ({ message: "user creater",  status: true , data: {user, token , coins , user_level}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "email has been already taken"} ,status: false, data : ""} )
         res.status(200).send(err_response)  
    // res.status(400).send(e)
}
})



router.post('/users/login' ,async (req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        const email = req.body.email
        console.log('req.body.email' + req.body.email)
        console.log('user.id' + user._id)
//        const user_level = await User_level.findOneAndUpdate({email : req.body.email , u_id: user._id}).exec()
        const user_level = await User_level.findOne({email : req.body.email}).exec()
        console.log(user_level)
        let success_response = ({ message: "success",  status: true , data: {user, token , user_level }})
        res.send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "email and password doesn`t match"} ,status: false,   data : ""})
        res.status(200).send(err_response)
        // res.status(400).send(e)
    }
})




router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})



router.post('/search',auth ,async (req,res) => {
    const user = req.body.name
    try {       
        const result = await User.find({ name: { $regex: user } });
        data.map(data => data.name).sort();
        let success_response = ({ message: "user found",  status: true , data: {result}})
        res.status(200).send(success_response)

    } catch (e){    
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})



router.post('/users/me', auth, async (req, res) => {
    res.send(req.user)
})  



router.get('/userlist', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let u_level = req.query.u_level

    console.log(req.query.u_level)
    if (!req.query.u_level ){
        req.query.u_level = ""
     }


    if (req.query.u_level !== ""){ 
        console.log("f_id != null")

                    let user = await User.find({u_level})

                try{
                    
                
                    let success_response = ({ message: "found",  status: true , data: {user}})
                    res.status(200).send(success_response)
                } catch (e) {
                    let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                    res.status(200).send(err_response)  
                }



    } else {

        console.log("f_id == null")
    let srt;
    if(req.query.sort == "desc"){
        srt = -1
    }else{
        srt = parseInt(req.query.sort)
    }
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "date"){
        sorter = {'date': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await  User.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }

}
})

// x:{"$gte": Xstart, "$lt": Xend}, z:{"$gte": Zstart, "$lt": Zend}




router.post('/users/ako', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'email', 'password', 'mobiile_number']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(200).send({ status: "error", message: "invalid updates"})
    }
})



router.post('/users/ako_assist',  async (req, res) => {
    const email = req.query.email
    const temp_pass = makeid(8)
    const temp_pass2 = await bcrypt.hash(temp_pass, 8)
    

    const find_user = await User.find({email}).exec() 
    console.log(find_user)

    const u_id = find_user._id

    


    try{
        const ua = await User.findOneAndUpdate({u_id},  
            {password: temp_pass2}, null, function (err, docs) { 
            if (err){ 
                console.log(err) 
               // res.status(400).send()
            } 
            else{ 
                console.log("Original Doc : ",docs)
                //res.send(docs)    
            } 
        });
        let success_response = ({ message: "this is you automated password",  status: true , data: {temp_pass}})
        res.status(200).send(success_response)
    }catch (e){
        let err_response = ({ message : { error : "invalid email"} ,status: false},{   data : ""})
        res.status(200).send(err_response)  
    }
})



function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}




router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})






// const upload = multer({
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload an image'))
//         }

//         cb(undefined, true)
//     }
// })

// router.post('/users/me/avatar', auth,upload.single('avatar'), async (req, res) => {
//     const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
//     req.user.avatar = buffer
//     await req.user.save()
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// router.delete('/users/me/avatar', auth, async (req, res) => {
//     req.user.avatar = undefined
//     await req.user.save()
//     res.send()
// })

// router.get('/users/:id/avatar', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)

//         if (!user || !user.avatar) {
//             throw new Error()
//         }

//         res.set('Content-Type', 'image/png')
//         res.send(user.avatar)
//     } catch (e) {
//         res.status(404).send()
//     }
// })



module.exports = router