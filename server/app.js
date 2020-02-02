const express = require('express')
const app = express()


app.use('/', express.static('./dist', {index: "index.html"}))
app.get('/callback/', express.static('./dist', {index: "index.html"}))
var port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))