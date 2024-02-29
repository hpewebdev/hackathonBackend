// rounds.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); 
const con = require('./connection'); 
const { verifyToken } = require('./auth'); 
const sendMessageToMobileNumber=require('./Otp_Func');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/'); // Set your upload folder
  },
  filename: (req, file, cb) => {
    // Append User_Name to the filename
    const { User_Name } = req.user; 
    const round_no = req.user.round_no;
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const fileName = `${originalName}_${User_Name}_round${round_no}${extension}`;
	console.log('Inside Multer Block' + fileName );
    cb(null, fileName);
  },
});

const upload = multer({ storage });


router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { User_Name } = req.user;
    const { round_no } = req.user; 

    
    if (round_no === 1) {
      
    const { Project_Title, Project_Description } = req.body;
    const Round1_Presentation_Path = req.file.path; 
 
    const Round1_Presentation_Name = Round1_Presentation_Path.slice(6);
console.log(Round1_Presentation_Name);
   
    const sql = `
      INSERT INTO Projects (Team_Name, Project_Title, Project_Description, Round1_Presentation_Path, Round1_Presentation_Name)
      VALUES (?, ?, ?, ?, ?)
    `;
    await con.query(sql, [User_Name, Project_Title, Project_Description, Round1_Presentation_Path, Round1_Presentation_Name]);

    res.status(201).json({ message: 'File uploaded and data saved successfully!' });
    const mobileNumber = '7008816424'; 
const messageToSend = 'Hello from Deba Desktop!'; 

sendMessageToMobileNumber(mobileNumber, messageToSend);
    }else {
      res.status(403).json({ error: 'Round 1 File upload not allowed' });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/round2', verifyToken, upload.array('files', 2), async (req, res) => {
  try {
    const { User_Name } = req.user;
    const { round_no } = req.user;
    console.log('In side Round 2 upload'+ User_Name );
    if (round_no === 2) {
      
      const [file1, file2] = req.files;      
      const Round2_SourceCode = file1.filename;
      const Round2_Presentation = file2.filename;
     console.log(Round2_SourceCode,Round2_Presentation );
      const sql = `
      UPDATE Projects
      SET Round2_SourceCode = ?, Round2_Presentation = ?
      WHERE Team_Name = ?
    `;
    
    await con.query(sql, [Round2_SourceCode, Round2_Presentation, User_Name]);

      res.status(201).json({ message: 'Round 2 saved' });
    } else {
      res.status(403).json({ error: 'Round 2 not allowed' });
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// GET /rounds/files: Retrieves a list of files
router.get('/test', async (req, res) => {
  try {
    // Retrieve data from the database
    const sql = 'SELECT * FROM Projects';
    const projects = await con.query(sql);
console.log(projects);
    // Generate download links for each file
    const filesWithLinks = projects.map((project) => ({
      ...project,
      Round1_Presentation_Link: `/files/${path.basename(project.Round1_Presentation_Path)}`,
    }));

    res.status(200).json(filesWithLinks);
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
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

// GET /rounds/files/:filename: Downloads a specific file
router.get('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'files', req.params.filename);
  res.download(filePath);
});

// GET /rounds/files: Retrieves a list of files
router.get('/roundno', verifyToken, async (req, res) => {
    try {
      const userName = req.user.User_Name;
      console.log(req.user.User_Name);
      //const userName = 'TestTeam';
  
      const query = `SELECT RoundNo FROM mst_team WHERE Team_Name = ?`;
      const roundNo = await con.query(query, [userName]);
// Now `roundNo` is an array containing the result, so destructuring works
const [roundNoValue] = roundNo;

  
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
