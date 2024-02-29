const express = require('express');
const router = express.Router();
const con = require('./connection'); 
const { verifyToken } = require('./auth'); 


router.get('/', (req, res) => {
    const query = `SELECT
	id,
    Team_Name,
    Project_Title,
    Project_Description,
    CONCAT_WS(' ', Leader_First_Name, Leader_Middle_Name, Leader_Last_Name, Leader_Project_Group, Leader_Email) AS Leader_Name,
    CONCAT_WS(' ', Team_Member_Name_1, Project_Group_1) AS Member1,
    CONCAT_WS(' ', Team_Member_Name_2, Project_Group_2) AS Member2,
    CONCAT_WS(' ', Team_Member_Name_3, Project_Group_3) AS Member3,
    Mobile_Number 
FROM
    mst_team
WHERE
    Enabled = 1;`;
    con.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      } else {
        res.status(200).json(result);
      }
    });
  });

  module.exports = router;