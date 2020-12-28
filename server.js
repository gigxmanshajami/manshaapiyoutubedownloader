
/* MANSA JAMI */

const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
var sslRedirect = require('heroku-ssl-redirect');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
app.use(sslRedirect());
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/urldownload', (req,res) => {
	var url = req.query.url;
	res.header("Content-Disposition", 'attachment; filename="youtube-vid-mj.mp4');
	ytdl(url, {format: 'mp4'}).pipe(res);
});