var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var port = process.env.PORT || 3000

app.use(express.urlencoded({ extended : false }))
app.use(express.json())
app.use(express.static(__dirname))

var dburl = 'mongodb+srv://<username>:<password>@cluster1.i5ksw.mongodb.net/<dbname>?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name : String,
    content : String
})

app.get('/messages', (req,res)=>{
    Message.find({}, (err,messages)=>{
        res.send(messages)
    })
})

app.post('/messages', (req,res)=>{
    var message = new Message(req.body)
    message.save((err)=>{
        if(err)
            sendStatus(500)
        io.emit('message',req.body)
        res.sendStatus(200) 
    })
})

io.on('connection', (socket)=>{
    console.log('Welcome new User!')
})

mongoose.connect(dburl, (err)=>{
    console.log('MongoDB connected!')
})

var server = http.listen(port, () =>{
    console.log("Application is listening on PORT", port)
})
