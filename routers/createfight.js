const express = require('express')
const Fight = require('../models/createfight')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/fight', auth, async (req, res) => {
    let ts = Math.round(Date.now() / 1000);
    let body = req.body
    const fight = new Fight({
        "u_id" : body.u_id,
        "fight_number":body.fight_number,
        "winner":body.winner,
        "winner_name":body.winner_name,
        "status":body.status,
        "match":body.match,
        "date": ts,
        "date_string": new Date(ts * 1000)
    })
    try {
        await fight.save()
        let success_response = ({ message: "success",  status_created: true , data: {fight}})
        res.status(201).send(success_response)
    } catch (e) {
        let err_response = ({ message : { error : "please fill the required field or the fight number has been taken"} ,status: false, data : ""} )
        res.status(200).send(err_response) 
        // res.status(400).send(e) 
    }
    })





    router.get('/fight_list_all', auth, async (req, res) => {
        let lim = parseInt(req.query.limit) 
        let page = parseInt(req.query.page)
        let pg = (lim * page) - lim
        let u_id = req.query.u_id
        let status = req.query.status

        console.log(req.query.status)
        if (!req.query.status ){
            req.query.status = ""
         }


        if (req.query.status !== ""){ 
            // console.log("f_id != null")

                        let fight = await Fight.find({status})

                    try{
                        
                    
                        let success_response = ({ message: "found",  status: true , data: {fight}})
                        res.status(200).send(success_response)
                    } catch (e) {
                        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                        res.status(200).send(err_response)  
                    }



        } else {

            // console.log("f_id == null")
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
           const result = await  Fight.find({ 
    
            }).skip(pg).sort(sorter).limit(lim).exec()
           
            let success_response = ({ message: "found",  status: true , data: {result}})
            res.status(200).send(success_response)
        } catch (e){
            let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
            res.status(200).send(err_response)  
        }

    }
    })

router.post('/fight_update/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status','winner']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const fight = await Fight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!fight) {
            return res.status(404).send()
        }

        res.send(fight)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router