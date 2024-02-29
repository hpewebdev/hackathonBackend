const express = require('express');
const Validator = require('validatorjs');
const router = express.Router();
const con = require('./connection'); 
const verifyToken = require("./auth").verifyToken;

// GET API for retrieving scores
router.get('/', (req, res) => {
    const query = `SELECT 
    ROW_NUMBER() OVER (ORDER BY TotalScore DESC) AS id,
    Team_Name, 
    Round_Num,
    Innovation,
    Complexity,
    Impact,
    Feasibility,
    Presentation, 
    Project_Title, 
    Project_Description,
    TotalScore
FROM (
    SELECT 
        mst_team.Team_Name, 
        Round_Num,
        Innovation,
        Complexity,
        Impact,
        Feasibility,
        Presentation, 
        mst_team.Project_Title, 
        mst_team.Project_Description,
        (Innovation + Complexity + Impact + Feasibility + Presentation) AS TotalScore
    FROM score_board
    JOIN mst_team ON mst_team.id = score_board.Team_Id
) AS subquery
ORDER BY TotalScore DESC;`;
    con.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      } else {
        res.status(200).json(result);
      }
    });
  });

  router.get('/teams', (req, res) => {
    const query = `SELECT Team_Name from mst_team;`;
    con.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      } else {
        res.status(200).json(result);
      }
    });
  });
  

// POST API for adding scores admin only
router.post('/', verifyToken, async (req, res) => { 
  try {
    const { Team_Id, Round_Num, Innovation, Complexity, Impact, Feasibility, Presentation } = req.body;
    await con.query(
      'INSERT INTO score_board (Team_Id, Round_Num, Innovation, Complexity, Impact, Feasibility, Presentation) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Team_Id, Round_Num, Innovation, Complexity, Impact, Feasibility, Presentation]
    );
    res.json({ message: 'Score added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add score' });
  }
});

module.exports = router;
