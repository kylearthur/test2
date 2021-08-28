const express = require('express')
const Payin = require('../models/payin')
const auth = require('../middleware/auth')
const { findOne } = require('../models/payin')
const router = new express.Router()

router.post('/request_payin', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const payin = new Payin({
        "u_id" : body.u_id,
        "name":body.name,
        "email":body.email,
        "request_payin":body.request_payin,
        "payment_method":body.payment_method,
        "payment_reference":body.payment_reference,
        "amount":body.amount,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await payin.save()
        res.status(201).send(payin)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.get('/request_payin_list', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let srt = parseInt(req.query.sort)
    let sortBy = req.query.sortBy
    let sorter = null

    if(sortBy == "date"){
        sorter = {'date': srt}
    } else{
        sorter = {}
    }


    try {
       const result = await Payin.find({ u_id

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        res.send(result)
    } catch (e){
        res.status(500).send()
    }
})


router.get('/request_payin_list_admin', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
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
       const result = await Payin.find({ 

        }).skip(pg).sort(sorter).limit(lim).exec()
       

        res.send(result)
    } catch (e){
        res.status(500).send()
    }
})


module.exports = router