const express = require('express');
const con = require('./connection'); 
const router = express.Router();

const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

router.post('/', (req, res) => {
  const empNo = req.body.empNo;

  
  if (!isNumeric(empNo)) {
    return res.status(400).json({ error: 'empNo must be a number' });
  }

  
  const checkQuery = `SELECT * FROM Teams WHERE Leader_ID = '${empNo}' OR Member2 = '${empNo}' OR Member3 = '${empNo}' OR Member4 = '${empNo}'`;

  con.query(checkQuery, (error, results) => { // Desired callback format
    if (error) {
      console.error('Error fetching Teams data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
console.log("results",results.length);
    if (results.length > 0) {
      return res.status(409).json({ message: 'User already registered' });
    }

    
    const SELECT_QUERY = 'SELECT * FROM Ess WHERE OFFICER_EMP_NO = ? LIMIT 1';

    con.query(SELECT_QUERY, [empNo], (error, results) => { // Maintain callback format
      if (error) {
        console.error('Error fetching employee data:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        res.status(404).json({ message: 'Employee not found' });
      } else {
        res.status(200).json(results[0]);
      }
    });
  });
});

module.exports = router;
