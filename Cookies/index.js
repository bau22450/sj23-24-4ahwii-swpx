var express = require("express"),
    session = require("express-session"),
    app = express(),
    MemcachedStore = require("connect-memcached")(session);

app.use(
    session({
        secret: "hehehihi",
        key: "test",
        proxy: "true",
        resave: false,
        saveUninitialized: false,
        store: new MemcachedStore({
            hosts: ["127.0.0.1:11211"],
            secret: "123, easy as ABC. ABC, easy as 123" // Optionally use transparent encryption for memcached session data
        })
    })
);

app.get("/", function (req, res) {
    if (req.session.username) {

    } else {
        req.session.username = "unknown";
    }
    res.send("Wilkommen " + req.session.username);
});

app.listen(9341, function () {
    console.log("Listening on %d", this.address().port);
});

app.post("/login", function (req, res) {
    const { username, password } = req.body;
    req.session.username = username;
    req.session.password = password;
    console.log(username);
});


app.get("/loginSeite", function (req, res) {
    res.sendFile(`${__dirname}/index.html`);
});