const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());


const auth=require('./auth');
const registerRoutes = require("./register");
const scoreboardRoutes = require("./scoreboard");
var cors = require("cors");
const roundsRoutes = require("./rounds");
const qualifyRoutes = require("./qualify");
const contactusRoutes = require("./contactus");
const teamsRoutes = require("./teams");
const empRoutes = require("./emp");
const teamNameRoutes = require("./teamname");
const registrationRoutes = require("./registration");
const regenerateOtpRoutes = require("./regotp");
const validateOtpRoutes = require("./validateotp");


app.use(cors());
app.post("/auth", auth.login);
app.use("/register", registerRoutes);
app.use("/scoreboard", scoreboardRoutes);
app.use("/qualify", qualifyRoutes);
app.use("/rounds", roundsRoutes);
app.use("/contactus", contactusRoutes);
app.use("/teams", teamsRoutes);
app.use("/emp",empRoutes);
app.use("/teamname",teamNameRoutes);
app.use("/registration",registrationRoutes);
app.use("/regotp",regenerateOtpRoutes);
app.use("/valotp",validateOtpRoutes);



const port = process.env.PORT || 443;



app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
