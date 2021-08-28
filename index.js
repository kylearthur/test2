const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const coinsRouter = require('./routers/cash')
const coinsoutRouter = require('./routers/cashout')
const coinsinRouter = require('./routers/cashin')
const roosterRouter = require('./routers/rooster_profile')
const u_levelRouter = require('./routers/u_level')
const payoutRouter = require('./routers/payout')
const bettingRouter = require('./routers/betting')
const user_profileRouter = require('./routers/user_profile')
const announcementRouter = require('./routers/announcement')
const createfightRouter = require('./routers/createfight')
const convertRouter = require('./routers/convert')
const apply_for_agentRouter = require('./routers/apply_for_agent')
const apply_for_playerRouter = require('./routers/apply_for_player')
const wala_o_meronRouter = require('./routers/meron_o_wala')
const totalRouter = require('./routers/totalbets')




const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(userRouter)
app.use(coinsRouter)
app.use(coinsoutRouter)
app.use(coinsinRouter)
app.use(roosterRouter)
app.use(u_levelRouter)
app.use(payoutRouter)
app.use(bettingRouter)
app.use(user_profileRouter)
app.use(announcementRouter)
app.use(createfightRouter)
app.use(convertRouter)
app.use(apply_for_agentRouter)
app.use(apply_for_playerRouter)
app.use(wala_o_meronRouter)
app.use(totalRouter)



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


// const User = require('./models/user')
// const main = async () => {
//     const user = await User.findById('5fb65f26fde3ef03d0eb55ef')
//     await user.populate('u_id').execPopulate()
//     console.log(user.u_id)
// }

// main()
