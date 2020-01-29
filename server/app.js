const express = require('express')
const app = express()
var port = process.env.port || 3000;

app.use('/', express.static('./dist', {index: "index.html"}))
app.get('/callback/', express.static('./dist', {index: "index.html"}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))