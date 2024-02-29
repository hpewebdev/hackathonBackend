const express = require('express');
const router = express.Router();
const con = require('./connection'); // Ensure correct path to your connection module
const verifyToken = require('./auth').verifyToken; // Ensure correct path to your auth module

router.get('/', verifyToken, async (req, res) => {
  try {
    const userName = req.user.round_no; // Assuming User_Name is extracted from the token
console.log("hello ");
    console.log(userName);
    //'SELECT RoundNo FROM mst_team WHERE Team_Name = ?';
    const query = 'SELECT RoundNo FROM mst_team WHERE Team_Name = ?';
    const [roundNo] = await con.query(query, [userName]); // Destructure result for efficiency

    if (!roundNo) {
      return res.status(404).send({ error: "No RoundNo found for the user's team" });
    }

    res.json({ roundNo });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error" });
  }
});

module.exports = router;

