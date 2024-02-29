// GET API for retrieving scores
router.get('/', (req, res) => {
    const query = `SELECT * from Projects`;
    con.query(query, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
      } else {
        res.status(200).json(result);
      }
    });
  });