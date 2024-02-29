const express = require('express');
const con = require('./connection'); 
const router = express.Router();
const verifyToken = require('./auth').verifyToken; 

const otpValidityDuration = 60 * 60 * 1000; 
router.post('/', verifyToken, async (req, res) => {
  try {
    //const { TeamName, otpCode } = req.body;
    const TeamName = req.user.User_Name;
    const otpCode = req.body.otpCode;

    if (!TeamName || !otpCode) {
      return res.status(400).json({success: 0, error: 'Missing TeamName or otpCode' });
    }

    const currentTime = Date.now();
    const oneHourAgo = currentTime - otpValidityDuration;

    const checkQuery = `
      SELECT * 
      FROM OTP_Records 
      WHERE Team_Name = ? 
      AND OTP_Code = ? 
      AND Time_Stamp >= ?
    `;

    await con.query(checkQuery, [TeamName, otpCode, oneHourAgo], async (error, results, fields) => {
      if (error) {
        console.error('Error fetching OTP data:', error);
        return res.status(500).json({success: 0, error: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(400).json({success: 0, error: 'Invalid OTP or expired' });
      }

      const updateQuery = `
        UPDATE mst_accnts 
        SET Otp_Verified = 1 
        WHERE User_Name = ?
      `;

      await con.query(updateQuery, [TeamName], (updateError, updateResults) => {
        if (updateError) {
          console.error('Error updating mst_accnts table:', updateError);
          return res.status(500).json({ success: 0, error: 'Internal server error' });
        }

        res.status(200).json({ success: 1, message: 'OTP verified successfully!' });
      });
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({success: 0, error: 'Internal server error' });
  }
});

module.exports = router;
