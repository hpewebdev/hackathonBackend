const express = require('express');
const con = require('./connection'); 
const sendmail = require('./sendmail'); 
const otpcode = require('./otpcode'); 
const sendOtp = require('./sendOtp'); 

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      UserName,
      password,
      Leader_ID,
      Team_Name,
      Mobile_Number,
      Member2,
      Member3,
      Member4,
    } = req.body;

    con.query('INSERT INTO Teams SET ?', {
      Leader_ID,
      Team_Name,
      Mobile_Number,
      Member2,
      Member3,
      Member4,
    }, (err, teamResult) => {
      if (err) {
        console.error('Error querying Teams table:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      con.query('INSERT INTO mst_accnts (User_Name, pass) VALUES (?, ?)', [UserName, password], (err, accntsResult) => {
        if (err) {
          console.error('Error querying mst_accnts table:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        sendmail(Team_Name);
        const randomNumber = otpcode(6);
        console.log(randomNumber);
        sendOtp(Team_Name, randomNumber);
        res.json({ message: 'You are successfully Registered' });


      });
    });
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
