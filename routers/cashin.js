const express = require('express')
const Coinsin = require('../models/cashin')
const Coins = require('../models/cash')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/cashin', auth, async (req, res) => {

    body = req.body
    u_id = body.u_id
    value = body.amount

    const c = await Coins.findOne({u_id})
    console.log(c)

    let total = c.amount + value; 


    const c2 = await Coins.findOneAndUpdate({u_id},  
        {amount: total}, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
           // res.status(400).send()
        } 
        else{ 
            console.log("Original Doc : ",docs)
          //  res.send(docs)    
        } 
    });

    
    

    // const coinsout = new Coinsout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        "amount":body.amount,
        "u_date_cashin":ts,
         u_id,
         "email":body.email,
         "attended_by":body.attended_by,
         "mobile_number":body.mobile_number,
         "date_attended":ts,
         "date_attended_string":new Date(ts * 1000),
        "u_date_cashin_string": new Date(ts * 1000)
    }

 const coinsin = new Coinsin(info)
    try {
        await coinsin.save()
        let success_response = ({ message: "success",  status: true , data: {coinsin}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
    })


router.get('/cashin_list', async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let srt;
    if(req.query.sort == "desc"){
        srt = -1
    }else{
        srt = parseInt(req.query.sort)
    }
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "u_date_cashin"){
        sorter = {'u_date_cashin': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await Coinsin.find({   u_id

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})


router.get('/cashin_list_admin', async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
  
    let srt = parseInt(req.query.sort)
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "u_date_cashin"){
        sorter = {'u_date_cashin': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await Coinsin.find({  

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})


module.exports = router