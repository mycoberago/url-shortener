require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const validUrl = require('valid-url');

var urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// app.get('/api/shorturl', function(req, res) {
//   res.send('Not Found');
// })
app.post('/api/shorturl', function(req, res) {
  console.log('its a post method')
  let { url } = req.body;
  //  check if it's a valid url
  if (!validUrl.isUri(url)) {
    res.json({ error: 'invalid url' })
  } else {

    //  check that it has http/https
    let valid_url = /^http|https/i;

    if (!url || !valid_url.test(url)) {
      return res.json({ error: 'invalid url' })
    }
    urls.push(url);
    res.json({ original_url: url, short_url: urls.indexOf(url) + 1 })
  }
})

app.get('/api/shorturl/:url', function(req, res) {
  let { url } = req.params;
  if (url) {
    console.log(urls[url - 1]);
    if (urls.length > 0 && urls[url - 1]) {
      res.redirect(urls[url - 1]);
    } else {
      res.json({ error: 'invalid url' });
    }

  } else {
    res.json({ error: 'invalid url' });
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
