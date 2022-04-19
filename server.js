const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/blogroll', { useNewUrlParser: true });

let Schema = mongoose.Schema;

let BlogSchema = new Schema({
    author: String,
    title: String,
    url: String
});

mongoose.model('Blog', BlogSchema);
let Blog = mongoose.model('Blog');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.get('/api/blogs', function(req, res) {
    Blog.find(function(err, docs) {
        docs.forEach( function(item) {
            console.log("Receive a GET request for id: " + item._id);
        });
        res.send(docs);
    })
});

app.post('/api/blogs', function(req, res) {
    console.log("Received a POST request");
    for (var key in req.body) {
        console.log(key + ': ' + req.body[key]);
    }
    let blog = new Blog(req.body);
    blog.save(function(err, doc) {
        res.send(doc);
    });
});

app.delete('/api/blogs/:id', function(req, res) {
    console.log('Received a DELETE id: ' + req.params.id );
    Blog.remove({
        _id: req.params.id
    }, function(err) {
        res.send({_id: req.params.id});
    });
});

app.put('/api/blogs/:id', function(req, res) {
    console.log("Received an UPDATE request id: " + req.params.id );
    Blog.update( { _id: req.params.id },
        req.body, function(err) {
            res.send({
                _id: req.params.id
            });
        }
    );
});



const port = 3000;
app.listen(port);
console.log('server on port ' + port);