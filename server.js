/* MANSA JAMI */
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const session = require('cookie-session');
const app = express();
const PORT = process.env.PORT || 3000;
const sanitize = require('sanitize-filename');
var nodemailer = require("nodemailer");
const queryString = require('querystring');
app.use(express.static(__dirname + '/public')

);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
app.get('/', (req, res) => {

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
app.get('/urldownload*', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        const qParameter = req.query.yes;
        console.log(qParameter);
        console.warn(videoUrl);
        // Get video information
        const info = await ytdl.getInfo(videoUrl);

        // Get the video title from the information

        const videoObj = {
            title: info.videoDetails.title,
            thumb: info.videoDetails.thumbnails,
            duration: info.videoDetails.lengthSeconds,
            embed: info.videoDetails.embed,
            infoMime: info.formats.sort((a, b) => {
                return a.mimeType < b.mimeType;
            }),
        }

        console.log("title:", videoObj.title, "thumb", videoObj.thumb, "duration:", videoObj.duration, "embed", videoObj.embed, "mime", videoObj.infoMime);

        // Set the filename with the video title and q parameter
        const fileName = `${videoObj.title}`;
        const sanitizedFilename = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
        // console.log(fileSantize);
        if (qParameter === "false") {
            res.json(videoObj);
        } else {
        const format = ytdl.chooseFormat(info.formats, { quality: "18" });
            console.log("hello",true);
            const outputFilePath = `${sanitizedFilename}.mp4`;
            const outputStream = fs.createWriteStream(outputFilePath);
            // Set the content disposition header to force download with the filename
            ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
            // When the download is complete, show a message
            outputStream.on('finish', () => {
                console.log(`Finished downloading: ${outputFilePath}`);
                res.end();
            });
        }
     
        // res.header("Content-Disposition", `attachment; filename="${sanitizedFilename}.mp4"`);
        // res.header("Content-Type", "video/mp4");

        // Set the content length header with the video size
        // res.header("Content-Length", videoObj.duration);
        // Pipe the video stream to the response
        // ytdl(videoUrl, { format: 'mp4' }).pipe(res);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json('Internal Server Error');
    }
});
app.get('/youtube.com/watch*', async (req, res) => {
    try {

        const videoUrl = "https://www.youtube.com/watch?v=" + req.query.v;

        // Get video information
        const info = await ytdl.getInfo(videoUrl);

        const videoObj = {
            title: info.videoDetails.title,
            thumb: info.videoDetails.thumbnails,
            duration: info.videoDetails.lengthSeconds,
            embed: info.videoDetails.embed,
        }

        // Set the filename with the video title and q parameter

        const fileName = `${videoObj.title}`;
        const sanitizedFilename = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
        // console.log(fileSantize);
        // Set the content disposition header to force download with the filename
        res.header("Content-Disposition", `attachment; filename="${sanitizedFilename}.mp4"`);
        res.header("Content-Type", "video/mp4");

        // Set the content length header with the video size
        res.header("Content-Length", videoObj.duration);
        // Pipe the video stream to the response
        ytdl(videoUrl, { format: 'mp4' }).pipe(res);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/send', function (req, res) {
    var mailOptions = {
        name: req.query.name,
        to: req.query.to,
        from: req.query.from,
        subject: req.query.subject,
        text: `NAME = ${req.query.name} \n MESSAGE = ${req.query.text} \n EMAIL OF USER = ${req.query.from}`
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, res) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + res.message);
            res.end("sent");
        }
    });
});

/*--------------------Routing Over----------------------------*/
