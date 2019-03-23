var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var cookieParser = require("cookie-parser");

app.use(cookieParser());

app.set("view engine", "ejs");

function generateRandomString() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 7; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

var urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  lsm5xK: { longURL: "http://www.google.com", userID: "user2RandomID" }
};


const Users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "a@b.c",
    password: "b"
  }
};

function retrieveUser(email, password, Users) {
  for (var user_id in Users) {
    let userEmail = Users[user_id]["email"]
    console.log(userEmail)
    let userPassword = Users[user_id]["password"]
    console.log(userPassword)
    if (email === userEmail && password === userPassword) {
      return Users[user_id];

    }
  }
  return false;
}

function checkEmail(email) {
  for (var user_id in Users) {
    // console.log(Users[user_id].email);
    // console.log(email);
    if (Users[user_id].email === email) {
      return true;
    }
  }
  return false;
}
// console.log(checkEmail("user22@example.com"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/urls", (req, res) => {
  const i = generateRandomString();
  urlDatabase[i] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect("/urls");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.post("/register", (req, res) => {
  // console.log(req.body)
  const i = generateRandomString();

  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  // console.log(req.body);
  if (checkEmail(email) === true) {
    res.status(400).send("You are already a registered user");
  } else if (!email || !password || !passwordConfirm || password !== passwordConfirm) {
    // console.log("bad conditions");
    res.redirect("/register");
  } else {
    const newUser = { id: i, email: email, password: password };
    Users[i] = newUser;
    res.cookie("user_id", i);
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: Users[req.cookies.user_id]
  };
  res.render("urls_login", templateVars);

  return;
});

app.get("/urls", (req, res) => {
  // console.log(req.cookies["user_id"]);
  // console.log(Users);
  let templateVars = {
    user: Users[req.cookies.user_id],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
  const longUrl = urlDatabase[req.params.shortUrl];
  res.redirect(longUrl);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortUrl", (req, res) => {
  let templateVars = {
    shortUrl: req.params.shortUrl,
    longUrl: urlDatabase[req.params.shortUrl],
    urls: urlDatabase,
    user: Users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortUrl/delete", (req, res) => {
  delete urlDatabase[req.params.shortUrl];
  res.redirect("/urls");
});

app.post("/urls/:shortUrl/update", (req, res) => {
  urlDatabase[req.params.shortUrl] = req.body.longURL;
  res.redirect("/urls");
});

// console.log("request body", req.body)
//     req.body.user_id == Users[user].email &&
//     Users[user].password === req.body.password
//   ) {

app.post("/login", (req, res) => {

  const user = retrieveUser(req.body.email, req.body.password, Users);
  // const userEmail = retrieveUser(req.body.email, req.body.password, Users);
  // const userPassword = retrieveUser(req.body.password, req.body.email, Users);
  // const email = req.body.email;
  // const password = req.body.password;
  // console.log(userEmail)
  // console.log(userPassword)



  if (user) {
    res.cookie(["user_id"], user.id);
    res.redirect("/urls");
  } else {
    res.status(400)
      .send("THOU shalt not pass");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  // console.log(`Example app listening on port ${PORT}!`);
});
