const nodemailer = require('nodemailer');
const con = require('./connection');

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

async function sendmail(TeamName) {
    try {
      console.log(TeamName);
  
      const SELECT_QUERY = `SELECT e.EMAIL_ID
      FROM Teams AS t
      JOIN Ess AS e ON e.OFFICER_EMP_NO IN (t.Leader_ID, t.Member2, t.Member3, t.Member4)
      WHERE t.Team_Name = ?`;
  
      await con.query(SELECT_QUERY, [TeamName], async (error, results, fields) => {
        if (error) {
          console.error('Error fetching team data:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        const validCCs = [];
        console.log(results.length);
  
        for (const row of results) {
          for (const email of Object.values(row)) {
            console.log(email);
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
          to: validCCs.join(', '), 
          subject: 'Greetings, Cosmic Voyager! 🌠, Registration Confirmation Hackathon',
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Cosmic Styles */
              body {
                background-color: #0a192f;
                color: #f9f9f9;
                font-family: 'Arial', sans-serif;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
              }
              h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                color: #66fcf1;
              }
              p {
                font-size: 1.2rem;
                line-height: 1.6;
              }
              strong {
                color: #45a29e;
              }
              ul {
                list-style-type: none;
                padding-left: 0;
              }
              li {
                margin-bottom: 1rem;
              }
             
              .icon {
                font-size: 1.5rem;
                margin-right: 0.5rem;
                color: #c5c6c7;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 CRIS Hackathon Rules 🌠</h1>
              <p>Welcome to the CRIS Hackathon, <strong>Dear ${TeamName} Team,</strong> Prepare to warp spacetime with your code. Here's your cosmic compass:</p>
              <ul>
                <li><span class="icon">🌟</span> **Infinite Horizons**: Our event transcends earthly boundaries. Imagine code as constellations, algorithms as cosmic dust, and creativity as dark matter.</li>
                <li><span class="icon">🌌</span> **Quantum Quandaries**: Within the event horizon lies the enigma of **"Cosmic Synergy"**. Decrypt it, and you'll unlock secrets woven into the cosmic tapestry.</li>
                <li><span class="icon">🌠</span> **Celestial Echoes**: Your lines of code resonate across light-years, echoing in the halls of binary gods.</li>
              </ul>
              <p>Prepare to warp spacetime, intrepid voyagers! 🌌</p>
              <p>Cosmically Yours,<br>
              Kailash Kumar<br>
              Hackathon Admin<br>
              CRIS Hackathon Cosmic Cartographer</p>
              <p>P.S. Keep your quarks entangled – wormholes of inspiration await! 🌀</p>
            </div>
          </body>
          </html>
          
          `,
        };
  
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  


module.exports = sendmail;



