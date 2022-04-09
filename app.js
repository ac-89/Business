const express = require(`express`);
const app = express();
const http = require(`http`);
const ejsMate = require(`ejs-mate`);
const path = require(`path`);
const nodemailer = require(`nodemailer`);
const multiparty = require("multiparty");
const reload = require(`reload`);
require("dotenv").config();

app.engine(`ejs`, ejsMate);
app.set(`view engine`, `ejs`);
app.set(`views`, path.join(__dirname, `views`));

app.use("/public", express.static("public"));

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/send", (req, res) => {
  //1.
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    console.log(data);

    //2. You can configure the object however you want
    const mail = {
      from: data.name,
      to: process.env.EMAIL,
      subject: data.subject,
      text: `${data.name} <${data.email}> \n${data.message}`,
    };

    //3.
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});

app.get(`/`, (req, res) => {
  res.render(`index`);
});

app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.ejs");
});

const server = http.createServer(app);

// Reload code here
reload(app)
  .then(function (reloadReturned) {
    // reloadReturned is documented in the returns API in the README

    // Reload started, start web server
    server.listen(app.get("port"), function () {
      console.log("Web server listening on port " + app.get("port"));
    });
  })
  .catch(function (err) {
    console.error(
      "Reload could not start, could not start server/sample app",
      err
    );
  });

app.listen(3000, () => {
  console.log("connected");
});
