// Use http module
let http = require('http');

// Use PORT environemnt variable
// Else use CLI argument
// Else use port 8080
port = process.env.PORT || process.argv[2] || 8080;

// Hello World server
/*
let server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello World!');
    res.end();
});
*/

const Index = () => (
  <div>
    <p>Hello World!</p>
  </div>
);

export default Index;

// Listen on port
server.listen(port, function () {
  console.log('Running on port:' + port);
})
