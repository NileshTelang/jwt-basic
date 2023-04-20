const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

let user = {
  id: "hvhsfda2bjgd347",
  email: "zoro@gmail.com",
  password: "mhtre73jghi1f9f4loj73m",
};

const JWT_SECRET = "supersecret";

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/forgot-password", (req, res, next) => {
  res.render("forgot-password");
});
app.post("/forgot-password", (req, res, next) => {
  const { email } = req.body;
  // res.send(email);

  //check if user exists
  if (email !== user.email) {
    res.send("User not registered");
    return;
  } else {
    const secret = JWT_SECRET + user.password;
    var payload = {
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `http://localhost:3342/reset-password/${user.id}/${token}`;
    console.log(link);
    res.send("Password reset link has been sent to your email...");
  }

  //User exists and create a one time link(valid for 15 mins)
});
app.get("/reset-password/:id/:token", (req, res, next) => {
  const { id, token } = req.params;

  //check if this id exists in database
  if (id !== user.id) {
    res.send("Invalid Id");
    return;
  }
  const secret = JWT_SECRET + user.password;
  try {
    var decoded = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});
app.post("/reset-password/:id/:token", (req, res, next) => {
  const { id, token } = req.params;
  res.send(user);
});

app.listen(3342, () => {
  console.log("Server is listening on http://localhost:3342");
});
