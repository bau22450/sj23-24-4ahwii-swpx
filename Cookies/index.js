const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
var express = require("express"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    app = express(),
    MemcachedStore = require("connect-memcached")(session);
app.use(bodyParser.urlencoded({ extended: true }));
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
        res.send("Wilkommen " + req.session.username + "<a href=' /Mitglieder '>Mitglieder</a>");
    } else {
        res.redirect("/loginSeite");
    }

});

app.listen(9341, function () {
    console.log("Listening on %d", this.address().port);
});

app.post("/login", async function (req, res) {
    const { username, password } = req.body;
    if (await getUser(username, password)) {
        req.session.username = username;
        req.session.password = password;
        res.send(`Login erfolgreich. Willkommen, ${username} du cooles kid!<br><a href="/Mitglieder">Mitglieder</a><br><a href="/logout">Logout</a><br><a href="/">Home</a>`);
    }
    else {
        res.send("SOOOOOOOOOOOOO nicht <a href='/loginSeite'>Nochmal</a>");
    }

});

async function getUser(username, password) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
                password: password,
            },
        });
        if (user === null) {
            return false;
        }
        console.log(user);
        return true;
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

app.get("/loginSeite", function (req, res) {
    res.sendFile(`${__dirname}/login.html`);
});

app.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.status(500).send("Logout failed.");
        }
        res.send("Erfolgreich ausgeloggt <a href='/'>Home</a>");
    });
});

app.post("/register", async function (req, res) {
    const { username, password } = req.body;
    await prisma.User.create({
        data: {
            username: username,
            password: password
        }

    })
    req.session.username = username;
    req.session.password = password;
    res.send("YIPPYYYYYYYYYY " + req.session.username + " hier gehts zu den <a href=' /Mitglieder '>Coolen kids</a>");
});

app.get("/Mitglieder", function (req, res) {
    if (req.session.username) {
        res.send("Wilkommen bei den Coolen Kids " + req.session.username + " <a href=' /logout '>Ciao</a>");
    } else {
        res.redirect("/loginSeite");
    }
});