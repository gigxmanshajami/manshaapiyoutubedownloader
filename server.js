/* MANSA JAMI */
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const session = require('cookie-session');
const app = express();
const PORT = process.env.PORT || 3000;
var nodemailer = require("nodemailer");
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
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "freeappstoreint@gmail.com",
        pass: "mansajami2020@gmail.com"
    }
});
/*------------------SMTP Over-----------------------------*/
app.get('/urldownload', (req,res) => {
	var url = req.query.url;
 
	res.header("Content-Disposition", 'attachment; filename="video.mp4');
	ytdl(url, {format: 'mp4'}).pipe(res);
});
app.get('/send',function(req,res){
    var mailOptions={
    	name: req.query.name,
        to : req.query.to,
        from: req.query.from,
        subject : req.query.subject,
        text : `NAME = ${req.query.name} \n MESSAGE = ${req.query.text} \n EMAIL OF USER = ${req.query.from}`
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, res){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + res.message);
           res.end("sent");
         }
});
});

/*--------------------Routing Over----------------------------*/
