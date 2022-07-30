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

app.get("/", (req, res) => {
    res.send("server is works!")
});

app.post("/post", (req, res) => {
    let pass = req.query.password;
    if (!pass) return res.status(403).end();
    if (pass !== password) return res.status(403).end();

    var fstream;
    req.pipe(req.busboy);

    req.busboy.on('file', (fieldname, file, filename) => {

        let namefile = filename.filename.replace(/ /g, "_");

        console.log("Uploading: " + namefile + "\nFrom: " + req.ip);
        fstream = fs.createWriteStream(`${process.cwd()}/public/${namefile}`);
        file.pipe(fstream);

        fstream.on('finish', () => {
            res.status(200).send(`${domain}/${namefile}`)
        })
    })
});

app.listen(port, () => console.log("Ready!"));