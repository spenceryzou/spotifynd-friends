const express = require('express')
const app = express()


app.use('/', express.static('./dist', {index: "index.html"}))
app.get('/callback/', express.static('./dist', {index: "index.html"}))
app.set('PORT', process.env.PORT || 5000);
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))