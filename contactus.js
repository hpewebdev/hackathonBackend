const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const con = require('./connection'); 
const fs = require('fs');
const { verifyToken } = require('./auth');

const handleError = (error, res) => {
  console.error('Error sending email:', error);
  res.status(500).json({ error: 'Internal server error' });
};

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

const transporter = nodemailer.createTransport({
  host: '10.77.32.48',
  port: 25,
  auth: {
    user: 'indianrailways@cris.org.in',
    pass: 'cris@123',
  },
});
router.post('/', verifyToken, async (req, res) => {
  try {
    const User_Name = req.user.User_Name;
    console.log(User_Name);

    const SELECT_QUERY = `SELECT e.EMAIL_ID
    FROM Teams AS t
    JOIN Ess AS e ON e.OFFICER_EMP_NO IN (t.Leader_ID, t.Member2, t.Member3, t.Member4)
    WHERE t.Team_Name = ?`;

    await con.query(SELECT_QUERY, [User_Name], async (error, results, fields) => {
      if (error) {
        console.error('Error fetching team data:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      const validCCs = [];

      for (const row of results) { 
        for (const email of Object.values(row)) { 
          if (isValidEmail(email)) {
            validCCs.push(email); 
          }
        }
      }

      if (!validCCs.length) {
        console.log('No valid CC email addresses found.');
        res.status(400).json({ error: 'No valid CC email addresses found.' });
        return;
      }

      
      const mailOptions = {
        from: 'indianrailways@cris.org.in',
        to: 'hpewebdev@gmail.com',
        cc: validCCs, 
        subject: User_Name + ' ' + req.body.subject,
        html: `
          <!DOCTYPE html>
          <html lang="en">
            ${req.body.mailBody}
          </html>
        `,
      };

      
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log('Email sent successfully:', info.messageId);
          res.status(200).json({ message: 'Email sent successfully!' });
        }
      });
    });
  } catch (error) {
    handleError(error, res);
  }
});
module.exports = router;
