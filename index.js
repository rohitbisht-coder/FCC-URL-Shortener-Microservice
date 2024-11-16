require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns= require("dns")
app.use(bodyParser.urlencoded({extended:false}))
// Basic Configuration
const port = process.env.PORT || 3000;
let urlDataBase = {}
let shortUrlCount = 1;
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl" , (req,res)=>{
    const originalUrl = req.body.url
    try{
      const parseUrl = new URL(originalUrl);
      dns.lookup(parseUrl.hostname , (err)=>{
        if(err){
          return res.json({error:"Invalid url"})
        }
        const shortUrl = shortUrlCount++
        urlDataBase[shortUrl] = originalUrl
        res.json({ original_url: originalUrl, short_url: shortUrl });
      })
    }catch(err){
      res.json({ error: 'invalid url' });
    }
})

app.get("/api/shorturl/:short_url" , (req,res)=>{
  const shortUrl = req.params.short_url
  const original_url = urlDataBase[shortUrl]
  if (original_url) {
    res.redirect(original_url);
} else {
    res.json({ error: 'No URL found' });
}
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
