const Crawler = require('./server/track-crawler');
const mongoose =  require('mongoose');
const express = require('express');

const url = "mongodb://development:272799029@ds157089.mlab.com:57089/better-track-database";
const app = express();
const port = process.env.PORT || 5000;
mongoose.connect(url);
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/api/hello', (req, res) => {
  Crawler.getMeets('2017', meets=>{res.send(meets)});
});

app.listen(port, () => console.log(`Listening on port ${port}`));