const express = require('express')
const Betting_meron = require('../models/betting_meron')
const Betting_wala = require('../models/betting_wala')
const Betting_draw = require('../models/betting_draw')
const Cash = require('../models/cash')
const auth = require('../middleware/auth')
const User_level = require('../models/u_level')
const User = require('../models/user')
const router = new express.Router()




router.post('/bet_meron', auth, async (req, res) => {  
    body = req.body
    amount = body.amount
    u_id = body.u_id
    fight_id = body.fight_id
    value = body.amount

   
      const shareAgent = async (_id,taya) =>{
             const user = await User.findById({_id});
            const u_email = user.email;
            const data = await User_level.findOne({email : u_email});
            const agent = data.my_agent_email;
            console.log('agent'+agent)
            const u_agent = await User.findOne({email : agent});
            const agentCash = await Cash.findOne({u_id : u_agent._id});
            console.log('u_agent._id'+u_agent._id);
            const agentShare = parseInt(taya) * .01;
            const agent_amount = agentCash.amount + agentShare;
            console.log('agent'+agent);
            const c2 = await Cash.findOneAndUpdate({u_id : u_agent._id}, 
                {amount:   agent_amount}, null, function (err, docs) { 
                if (err){ 
                    console.log(err) 
                   // res.status(400).send()
                } 
                else{ 
                    // console.log("Original Doc : ",docs)
                  //  res.send(docs)    
                } 
            });

            console.log('agent'+c2)
           
        }
        const shareMasterAgent = async (_id,taya) =>{
          const user = await User.findById({_id});
            const u_email = user.email;
            const data = await User_level.findOne({email : u_email});
            const master_agent = data.my_master_agent_email;
            console.log('master_agent'+master_agent);
            const u_master = await User.findOne({email : master_agent});
            const master_agentCash = await Cash.findOne({u_id : u_master._id});
            console.log('u_master._id'+u_master._id);
            const masteragentShare = parseInt(taya) * .01 ;
            const master_amount = master_agentCash.amount + masteragentShare;
            console.log(" master_agent"+ master_agent);
        
            const c2 = await Cash.findOneAndUpdate({u_id : u_master._id}, 
                {amount:  master_amount}, null, function (err, docs) { 
                if (err){ 
                    console.log(err) 
                   // res.status(400).send()
                } 
                else{ 
                    // console.log("Original Doc : ",docs)
                  //  res.send(docs)    
                } 
            });
            console.log('master_agent'+c2)
        }

                      


    const c = await Cash.findOne({u_id})
    const f_id = await Betting_meron.findOne({fight_id, u_id})
    // console.log("f_id"+f_id)
    if(f_id !== null){
        const bet_meron_id =  f_id._id
        // console.log("bet_meron_id" + bet_meron_id)
        const previous_amount =  f_id.amount
        // console.log("previous_amount"+previous_amount)
    }
   
   
    let total = c.amount - value  ; 
    const c2 = await Cash.findOneAndUpdate({u_id}, 
        {amount: total}, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
           // res.status(400).send()
        } 
        else{ 
            // console.log("Original Doc : ",docs)
          //  res.send(docs)    
        } 
    });
    // const coinsout = new Coinsout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        amount,
        "fight_number":body.fight_number,
        "u_date_bet":ts,
        u_id,
       fight_id,
        "u_date_bet_string": new Date(ts * 1000)
    }

    shareAgent(u_id,value) 
    shareMasterAgent(u_id,value)
  
// if (typeof bet_meron_id === null ){ 
    let success_response = {}
    if(f_id === null){
   const betting = new Betting_meron(info)
       
        try {
           
            // console.log(info)
        // console.log("new")
        await betting.save()
          success_response = ({ message: "success",  status: true , data: {betting}})
           res.status(201).send(success_response)
       } catch (e) {
           let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
           res.status(200).send(err_response)  
        // res.status(400).send(e) 
       }
    }else{
        console.log("f_id.amount"+f_id.amount)
        // console.log("previous")
        let total = parseInt(f_id.amount) + parseInt(body.amount) ;
        console.log(total)
           const betting = await Betting_meron.findOneAndUpdate({_id : f_id._id}, 
               {amount: total}, null, function (err, docs) { 
               if (err){ 
                   console.log(err) 
                   let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                   res.status(200).send(err_response)  
                // res.status(400).send(err) 
               } 
               else{ 
                //    console.log("Original Doc : ",docs)
                    success_response = ({ message: "success",  status: true , data: {docs}})
                 //  res.send(docs)    
                 res.status(201).send(success_response)
               } 
           });
        }
})





router.get('/bet_list_meron', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let fight_number = req.query.fight_number

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
       const result = await  Betting_meron.find({ fight_number

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})


router.post('/bet_wala', auth, async (req, res) => {  
    body = req.body
    amount = body.amount
    u_id = body.u_id
    fight_id = body.fight_id
    value = body.amount


    const shareAgent = async (_id,taya) =>{
        const user = await User.findById({_id});
       const u_email = user.email;
       const data = await User_level.findOne({email : u_email});
       const agent = data.my_agent_email;
       console.log('agent'+agent)
       const u_agent = await User.findOne({email : agent});
       const agentCash = await Cash.findOne({u_id : u_agent._id});
       console.log('u_agent._id'+u_agent._id);
       const agentShare = parseInt(taya) * .01;
       const agent_amount = agentCash.amount + agentShare;
       console.log('agent'+agent);
       const c2 = await Cash.findOneAndUpdate({u_id : u_agent._id}, 
           {amount:   agent_amount}, null, function (err, docs) { 
           if (err){ 
               console.log(err) 
              // res.status(400).send()
           } 
           else{ 
               // console.log("Original Doc : ",docs)
             //  res.send(docs)    
           } 
       });

       console.log('agent'+c2)
      
   }
   const shareMasterAgent = async (_id,taya) =>{
     const user = await User.findById({_id});
       const u_email = user.email;
       const data = await User_level.findOne({email : u_email});
       const master_agent = data.my_master_agent_email;
       console.log('master_agent'+master_agent);
       const u_master = await User.findOne({email : master_agent});
       const master_agentCash = await Cash.findOne({u_id : u_master._id});
       console.log('u_master._id'+u_master._id);
       const masteragentShare = parseInt(taya) * .01 ;
       const master_amount = master_agentCash.amount + masteragentShare;
       console.log(" master_agent"+ master_agent);
   
       const c2 = await Cash.findOneAndUpdate({u_id : u_master._id}, 
           {amount:  master_amount}, null, function (err, docs) { 
           if (err){ 
               console.log(err) 
              // res.status(400).send()
           } 
           else{ 
               // console.log("Original Doc : ",docs)
             //  res.send(docs)    
           } 
       });
       console.log('master_agent'+c2)
   }
    
    const c = await Cash.findOne({u_id})
    const f_id = await Betting_wala.findOne({fight_id, u_id})
    console.log("f_id"+f_id)
    if(f_id !== null){
        const bet_wala_id =  f_id._id
        console.log("bet_wala_id" + bet_wala_id)
        const previous_amount =  f_id.amount
        console.log("previous_amount"+previous_amount)
    }
   
   
    let total = c.amount - value  ; 
    const c2 = await Cash.findOneAndUpdate({u_id}, 
        {amount: total}, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
           // res.status(400).send()
        } 
        else{ 
            // console.log("Original Doc : ",docs)
          //  res.send(docs)    
        } 
    });
    // const coinsout = new Coinsout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        amount,
        "fight_number":body.fight_number,
        "u_date_bet":ts,
        u_id,
       fight_id,
        "u_date_bet_string": new Date(ts * 1000)
    }
    shareAgent(u_id,value) 
    shareMasterAgent(u_id,value)
  
// if (typeof bet_meron_id === null ){ 
    let success_response = {}
    if(f_id === null){
        const betting = new Betting_wala(info)
       
        try {
           
            // console.log(info)
        console.log("new")
        await betting.save()
        success_response = ({ message: "success",  status: true , data: {betting}})
          
         
           res.status(201).send(success_response)
       } catch (e) {
           let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
           res.status(200).send(err_response)  
       }
    }else{
        console.log("f_id.amount"+f_id.amount)
        console.log("previous")
        let total = parseInt(f_id.amount) + parseInt(body.amount) ;
        console.log(total)
           const betting = await Betting_wala.findOneAndUpdate({_id : f_id._id}, 
               {amount: total}, null, function (err, docs) { 
               if (err){ 
                   console.log(err) 
                   let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                   res.status(200).send(err_response)  
               } 
               else{ 
                //    console.log("Original Doc : ",docs)
                    success_response = ({ message: "success",  status: true , data: {docs}})
                 //  res.send(docs)    
                 res.status(201).send(success_response)
               } 
           });
        }
})





router.get('/bet_list_wala', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let fight_number = req.query.fight_number


    
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
       const result = await  Betting_wala.find({ fight_number

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false},{   data : ""})
        res.status(200).send(err_response)  
    }
})





router.post('/bet_draw', auth, async (req, res) => {  
    body = req.body
    amount = body.amount
    u_id = body.u_id
    fight_id = body.fight_id
    value = body.amount

    const shareAgent = async (_id,taya) =>{
        const user = await User.findById({_id});
       const u_email = user.email;
       const data = await User_level.findOne({email : u_email});
       const agent = data.my_agent_email;
       console.log('agent'+agent)
       const u_agent = await User.findOne({email : agent});
       const agentCash = await Cash.findOne({u_id : u_agent._id});
       console.log('u_agent._id'+u_agent._id);
       const agentShare = parseInt(taya) * .01;
       const agent_amount = agentCash.amount + agentShare;
       console.log('agent'+agent);
       const c2 = await Cash.findOneAndUpdate({u_id : u_agent._id}, 
           {amount:   agent_amount}, null, function (err, docs) { 
           if (err){ 
               console.log(err) 
              // res.status(400).send()
           } 
           else{ 
               // console.log("Original Doc : ",docs)
             //  res.send(docs)    
           } 
       });

       console.log('agent'+c2)
      
   }
   const shareMasterAgent = async (_id,taya) =>{
     const user = await User.findById({_id});
       const u_email = user.email;
       const data = await User_level.findOne({email : u_email});
       const master_agent = data.my_master_agent_email;
       console.log('master_agent'+master_agent);
       const u_master = await User.findOne({email : master_agent});
       const master_agentCash = await Cash.findOne({u_id : u_master._id});
       console.log('u_master._id'+u_master._id);
       const masteragentShare = parseInt(taya) * .01 ;
       const master_amount = master_agentCash.amount + masteragentShare;
       console.log(" master_agent"+ master_agent);
   
       const c2 = await Cash.findOneAndUpdate({u_id : u_master._id}, 
           {amount:  master_amount}, null, function (err, docs) { 
           if (err){ 
               console.log(err) 
              // res.status(400).send()
           } 
           else{ 
               // console.log("Original Doc : ",docs)
             //  res.send(docs)    
           } 
       });
       console.log('master_agent'+c2)
   }




    const c = await Cash.findOne({u_id})
    const f_id = await Betting_draw.findOne({fight_id, u_id})
    console.log("f_id"+f_id)
    if(f_id !== null){
        const bet_draw_id =  f_id._id
        console.log("bet_draw_id" + bet_draw_id)
        const previous_amount =  f_id.amount
        console.log("previous_amount"+previous_amount)
    }
   
   
    let total = c.amount - value  ; 
    const c2 = await Cash.findOneAndUpdate({u_id}, 
        {amount: total}, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
           // res.status(400).send()
        } 
        else{ 
            // console.log("Original Doc : ",docs)
          //  res.send(docs)    
        } 
    });
    // const coinsout = new Coinsout(info)
    let ts = Math.round(Date.now() / 1000);
    
    const info = {
        amount,
        "fight_number":body.fight_number,
        "u_date_bet":ts,
        u_id,
       fight_id,
        "u_date_bet_string": new Date(ts * 1000)
    }


    shareAgent(u_id,value) 
    shareMasterAgent(u_id,value)
  
// if (typeof bet_meron_id === null ){ 
    let success_response = {}
    if(f_id === null){
        const betting = new Betting_draw(info)
       
        try {
           
            // console.log(info)
        console.log("new")
        await betting.save()
        success_response = ({ message: "success",  status: true , data: {betting}})
          
         
           res.status(201).send(success_response)
       } catch (e) {
           let err_response = ({ message : { error : "please fill the required field"} ,status: false, data : ""} )
           res.status(200).send(err_response)  
       }
    }else{
        console.log("f_id.amount"+f_id.amount)
        console.log("previous")
        let total = parseInt(f_id.amount) + parseInt(body.amount) ;
        console.log(total)
           const betting = await Betting_draw.findOneAndUpdate({_id : f_id._id}, 
               {amount: total}, null, function (err, docs) { 
               if (err){ 
                   console.log(err) 
                   let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
                   res.status(200).send(err_response)  
               } 
               else{ 
                //    console.log("Original Doc : ",docs)
                    success_response = ({ message: "success",  status: true , data: {docs}})
                 //  res.send(docs)    
                 res.status(201).send(success_response)
               } 
           });
        }
})





router.get('/bet_list_draw', auth, async (req, res) => {
    let lim = parseInt(req.query.limit) 
    let page = parseInt(req.query.page)
    let pg = (lim * page) - lim
    let u_id = req.query.u_id
    let fight_number = req.query.fight_number

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
       const result = await  Betting_draw.find({ u_id

        }).skip(pg).sort(sorter).limit(lim).exec()
       
        let success_response = ({ message: "found",  status: true , data: {result}})
        res.status(200).send(success_response)
    } catch (e){
        let err_response = ({ message : { error : "no result"} ,status: false, data : ""} )
        res.status(200).send(err_response)  
    }
})




module.exports = router