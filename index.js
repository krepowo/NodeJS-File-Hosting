var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    busboy = require('connect-busboy'),
    config = require('./config.json'),
    app = express(),

    dir = path.join(__dirname, 'public'),

    domain = config.domain,
    password = config.password,
    port = config.port;

app.use('/', express.static(dir));

app.use(busboy());

app.post("/post", (req, res) => {
    let pass = req.query.password;
    if (pass !== password) return res.status(403).end()

    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log("Uploading: " + filename.filename + "\nFrom: " + req.ip);
        fstream = fs.createWriteStream(`${process.cwd()}/public/${filename.filename}`);
        file.pipe(fstream);
        fstream.on('finish', () => {
            res.status(200).send(`${domain}/${filename.filename}`)
        })
    })
});

app.listen(port, () => console.log("Ready!"));