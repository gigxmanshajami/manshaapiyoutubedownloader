/* MANSA JAMI */
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const session = require('cookie-session');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public')

);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
app.get('/', (req, res) => {
	if (req.headers["x-forwarded-proto"] === "http") {
		   res.redirect('https://' + req.headers.host + req.url);
	}
    res.sendFile(__dirname + '/index.html');
});
app.get('/urldownload', (req,res) => {
	var url = req.query.url;
	res.header("Content-Disposition", 'attachment; filename="video-mj-yt.mp4');
	ytdl(url, {format: 'mp4'}).pipe(res);
});