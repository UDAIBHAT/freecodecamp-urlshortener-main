require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Shortened links storage
let shortened = {}
let nextShortUrl = 1

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  
  // Check if URL is provided
  if (!url) {
    return res.json({ error: "invalid url" });
  }
  
  // URL validation - basic check for http/https
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Check if URL already exists
    const existingShortUrl = Object.keys(shortened).find(key => shortened[key] === url);
    
    if (existingShortUrl) {
      return res.json({
        original_url: url,
        short_url: parseInt(existingShortUrl)
      });
    }
    
    // Create new short URL
    const shortUrl = nextShortUrl;
    shortened[shortUrl] = url;
    nextShortUrl++;
    
    res.json({
      original_url: url,
      short_url: shortUrl
    });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get('/api/shorturl/:number', (req, res) => {
  const shortUrl = req.params.number;
  
  if (shortened[shortUrl]) {
    res.redirect(shortened[shortUrl]);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
