const express = require('express');
const app = express();
const mongoose = require('mongoose');
const stockRoutes = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
 
let Stock = require('./stock.model');
 
app.use(cors());
app.use(bodyParser.json());
 
mongoose.connect('mongodb://127.0.0.1:27017/stocks', { useNewUrlParser: true });
const connection = mongoose.connection;
 
connection.once('open', function() {
    console.log("MongoDB connection established.");
})
 
stockRoutes.route('/').get(function(req, res) {
    Stock.find(function(err, stocks) {
        if (err) {
            console.log(err);
        } else {
            res.json(stocks);
        }
    });
});
 
stockRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Stock.findById(id, function(err, stock) {
        res.json(stock);
    });
});
 
stockRoutes.route('/add').post(function(req, res) {
    let stock = new Stock(req.body);
    stock.save()
        .then(stock => {
            res.status(200).json({'stock': 'Stock added'});
        })
        .catch(err => {
            res.status(400).send('Error adding new Stock');
        });
});
 
stockRoutes.route('/update/:id').post(function(req, res) {
    Stock.findById(req.params.id, function(err, stock) {
        if (!stock)
            res.status(404).send('there is not data');
        else
            stock.stock_name = req.body.stock_name;
            stock.stock_ticket = req.body.stock_ticket;
            stock.stock_value = req.body.stock_value;
 
            stock.save().then(stock => {
                res.json('Stock updated');
            })
            .catch(err => {
                res.status(400).send("Update error");
            });
    });
});
 
stockRoutes.route('/delete/:id').get(function (req, res) {
    Stock.findByIdAndRemove({_id: req.params.id}, function(err, stocks){
        if(err) res.json(err);
        else res.json('Stock removed');
    });
});
 
app.use('/stocks', stockRoutes);
 
app.listen(PORT, function() {
    console.log("Server is running. Port: " + PORT);
});