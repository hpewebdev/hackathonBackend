const express = require('express');
const con = require('./connection');
const { validateTeamData } = require('./validateData');
const verifyToken = require("./auth").verifyToken;
const sendmail = require('./sendmail');
const otpcode=require('./otpcode');
const sendOtp=require('./sendOtp');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      UserName,
      password,
      Leader_Email,
      Leader_First_Name,
      Leader_Middle_Name,
      Leader_last_Name,
      Leader_Project_Group,
      Team_Name,
      Team_Member_Name_1,
      Team_Member_Email_1,
      Project_Group_1,
      Team_Member_Name_2,
      Team_Member_Email_2,
      Project_Group_2,
      Team_Member_Name_3,
      Team_Member_Email_3,
      Project_Group_3,
      Mobile_Number,
    } = req.body;

    const isValid = await validateTeamData(req.body);

    if (!isValid) {
      //res.status(400).json({ message: 'Validation failed', errors }); // Send the error messages array
      res.status(400).json({ message: 'Validation failed', errors: [error.message] });
      return;
    }

    const [accntsResult, teamResult] = await Promise.all([
      con.query('INSERT INTO mst_accnts (User_Name, pass) VALUES (?, ?)', [UserName, password]),
      con.query('INSERT INTO mst_team SET ?', {
        Leader_Email,
        Leader_First_Name,
        Leader_Middle_Name,
        Leader_last_Name,
        Leader_Project_Group,
        Team_Name,
        Team_Member_Name_1,
        Team_Member_Email_1,
        Project_Group_1,
        Team_Member_Name_2,
        Team_Member_Email_2,
        Project_Group_2,
        Team_Member_Name_3,
        Team_Member_Email_3,
        Project_Group_3,
        Mobile_Number,
      }),
    ]);
    console.log('above sendemaill call');
    sendmail(Leader_Email, Team_Name);
    const randomNumber = otpcode(6); 

const formattedMessage = `Your OTP is: ${randomNumber}`;
console.log(formattedMessage);
//await sendOtp(Mobile_Number, formattedMessage);
console.log(`Sent OTP ${randomNumber} to ${Mobile_Number}`);
    console.log(Leader_Email,Team_Name);
    res.json({ message: 'Thank you for joining our exciting AI/ML hackathon! Your passion for innovation and learning is truly commendable. As you embark on this journey, remember that every line of code you write, every algorithm you tweak, and every idea you bring to life has the potential to shape the future' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting data' });
  }
});

// Assuming you've set up your Express app
router.get('/checkname', async (req, res) => {
    try {
      const teamName = req.query.teamName; // Get the team name from the query parameter
  
      // Execute the query
      const query = 'SELECT COUNT(*) AS teamCount FROM mst_team WHERE LOWER(Team_Name) = ?';
      const [results] = await con.query(query, [teamName.toLowerCase()]);
  
      // Extract the count
      const teamCount = results[0].teamCount;
  
      // Return 0 if count is 0, else return 1
      const response = teamCount === 0 ? 0 : 1;
  
      res.status(200).json({ result: response });
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
