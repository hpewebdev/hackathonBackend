const express = require('express');
const con = require('./connection');
const router = express.Router();


router.post('/', (req, res) => {
    const teamName = req.body.teamName;
  console.log(teamName);
    const SELECT_QUERY = 'SELECT * FROM Teams WHERE Team_Name = ?';
  
    con.query(SELECT_QUERY, [teamName], (error, results) => {
      if (error) {
        console.error('Error fetching employee data:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(200).json({ message: 'Team Valid You Can Proceed' });
      } else {
        res.status(400).json({ message: 'TeamName Already Registered' }); 
      }
    });
  });
  

module.exports = router;