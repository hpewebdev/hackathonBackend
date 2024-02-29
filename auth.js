const con = require("./connection");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const JWTkey = "asdgsfgfhreqrpinfwepofjecvneccjecnlcqpudfwejfleqnlfjewlknclek";

exports.login = (req, res) => {
  console.log(req.body);
if (!req.body) {

    return res.status(400).send({ error: "Please provide a valid request body 1" });
  }
 
const user = req.body.user_id;
const pwd =  req.body.password;


  if (!user || !pwd) {
    return res.status(400).send({ error: "Please provide both username and password" });
  }
  const query = `SELECT id, round_no, Otp_Verified, Role_ID, User_Name FROM mst_accnts WHERE User_Name = ? AND pass = ? AND Enabled = 1;`;

  con.query(query, [user, pwd], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: "Server error" });
    }
    if (data.length === 0) {
      return res.status(400).send({ error: "Incorrect username and password" });
    }
    const payload = { user: data[0] };
    const options = { expiresIn: "1h" };
    jwt.sign(payload, JWTkey, options, (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: "Server error" });
      }
const ldate = moment().format("YYYY-MM-DD HH:mm:ss");
   
console.log(`User: ${user}, logged in at ${ldate} `);
      res.json({ data: payload.user, token });
    });
  });
};

exports.verifyToken = (req,res,next)=>{
   const bearerHeader=req.headers['authorization'];
   if(typeof bearerHeader !=='undefined'){
       const bearer=bearerHeader.split(' ');
       const bearerToken=bearer[1];
       req.token=bearerToken;
       jwt.verify(req.token,JWTkey,(err,data)=>{
           if(err){
               res.sendStatus(403);
           }else{
               
               req.user = data.user;
               next();
           }
       })
   }else{
       res.sendStatus(403);
   }
}