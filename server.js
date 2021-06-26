var express = require('express')
//var bodyParser = require('body-parser')
var app = express()
//http module from node is used
//app is passed to the server
var http = require('http').Server(app)
//passing http to socket.io
var io = require('socket.io')(http)
var mongoose = require('mongoose')
//if no port is fixed then 5000
//process.env.PORT - any port heroku works
var port = process.env.PORT || 3000

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended : false }))
// For parsing application/json
app.use(express.json())
//using a static file, entire directory instead of separate file
app.use(express.static(__dirname))

var dburl = 'mongodb+srv://<username>:<password>@cluster1.i5ksw.mongodb.net/<dbname>?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name : String,
    content : String
})

app.get('/messages', (req,res)=>{
    //empty requirements so all the messages in the database is selected
    Message.find({}, (err,messages)=>{
        res.send(messages) //dynamic messages
    })
})

app.post('/messages', (req,res)=>{
    var message = new Message(req.body)
    message.save((err)=>{
        if(err)
            sendStatus(500)
        io.emit('message',req.body)
        res.sendStatus(200) //200 - everything went OK
    })
    //console.log(req.body) //the request sent
    //this will display undefined in the console as express doesn't have built in support
    //to make it happen, you need to install body parser
})

io.on('connection', (socket)=>{
    console.log('Welcome new User!')
})

mongoose.connect(dburl, (err)=>{
    console.log('MongoDB connected!')
})

//node http server is used so that both express and socket.io is running
var server = http.listen(port, () =>{
    console.log("Application is listening on PORT", port)
})
