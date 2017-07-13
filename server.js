const express = require("express"),
      path = require("path");

// Initialize the web app instance,
// along with the desired view engine
// for rendering view templates.
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Indicate which directory static resources
// (e.g. stylesheets) should be served from.
app.use(express.static(path.join(__dirname, "public")));

// Expose a default route, and begin listening for requests.
app.get("/", require("./routes/index"));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
 
