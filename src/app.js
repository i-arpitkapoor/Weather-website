const path = require("path"); // in express to serve up static files like html we need to provide absolute paths. this helps in facilitating such things // path is a core node moudle
const express = require("express"); // express library exports single function and not object
const hbs = require("hbs");
const geoCode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000; // port equal to first value if it exists else its equal to 3000

// console.log(__dirname)
// console.log(__filename)

// console.log(path.join(__dirname, '../public'))

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup Handlebars engine and views location
app.set("view engine", "hbs"); // key value pair we are telling express that we are using hbs (handlebars)
app.set("views", viewsPath); // to tell express to look for all dynamic hbs files in this location
hbs.registerPartials(partialsPath);

// set up static directory to serve
app.use(express.static(publicDirectoryPath)); // to serve public folder

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Siddharth Garg",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Siddharth Garg",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "This is a help message",
    title: "HELP",
    name: "Siddharth Garg",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geoCode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error }); // shorthand sytnax for error: error
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );

  // res.send({
  //     forecast: 'Rainy',
  //     location: 'Delhi',
  //     address: req.query.address
  // })
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: 404,
    message: "Help article not found",
    name: "Siddharth Garg",
  });
  // res.send('Help article not found')
});

app.get("*", (req, res) => {
  res.render("error", {
    title: 404,
    message: "Page not found",
    name: "Siddharth Garg",
  });
  // res.send("my 404 page")
});

app.listen(port, () => {
  // the process of starting a server is sync or async. i dont know ask.
  console.log("Server is up on port " + port);
});
