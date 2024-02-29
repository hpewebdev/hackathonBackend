const express = require('express');
const con = require('./connection'); 
const router = express.Router();
const otpcode = require('./otpcode'); 
const verifyToken = require('./auth').verifyToken; 
const sendOtp = require('./sendOtp'); 


router.post('/', verifyToken, async (req, res) => {
  try {
    
    const TeamName = req.user.User_Name;

    if (!TeamName) {
      return res.status(400).json({ error: 'Missing TeamName' });
    }

    
    const randomNumber = otpcode(6);
    console.log(randomNumber);

    
    await sendOtp(TeamName, randomNumber);

    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
