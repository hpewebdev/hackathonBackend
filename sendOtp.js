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

async function sendOtp(TeamName, otpcode) {
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

      await con.query('INSERT INTO OTP_Records (Team_Name, OTP_Code) VALUES (?, ?)', [TeamName, otpcode], (err, insertResult) => {
        if (err) {
          console.error('Error inserting OTP record:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
      });

      const mailOptions = {
        from: 'indianrailways@cris.org.in',
        to: validCCs.join(', '),
        subject: '✨ OTP for CRIS Hackathon 2024 🌠 ',
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRIS Hackathon 2024</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f9f9f9;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        h1 {
            font-size: 2.5rem;
            color: #007bff;
            margin-bottom: 20px;
            font-family: 'Playfair Display', serif;
        }
        .icon {
            font-size: 2rem;
            margin-right: 10px;
        }
        .otp-code {
            font-weight: bold;
            color: #28a745;
            font-family: 'Cormorant Garamond', serif;
        }
        p {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 15px;
            font-family: 'Lora', serif;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><span class="icon">🚀</span> CRIS Hackathon 2024</h1>
        <p>Dear esteemed <span class="otp-code">${TeamName}</span> explorers,</p>
        <p>As we embark on this cerebral odyssey into the realms of artificial intelligence and machine learning, let us unfurl our sails and navigate the uncharted waters of innovation.</p>
        <p>Your <span class="otp-code">OTP CODE</span> for the gateway to our digital wonderland is: <span class="otp-code">${otpcode}</span>. Guard it like a dragon guards its hoard!</p>
        <p>Remember, in this hallowed arena, we are not mere mortals; we are architects of algorithms, poets of pixels, and dreamers of data.</p>
        <p>May your code be as elegant as a sonnet, your logic as robust as a Gothic cathedral, and your creativity as boundless as the cosmos.</p>
        <p>Let us forge connections, debug dilemmas, and sculpt solutions. The binary whispers of the universe await our deciphering.</p>
        <p>With caffeinated minds and keyboards at the ready, let us script our own saga—one line at a time.</p>
        <p>Happy hacking, fellow <span class="otp-code">code whisperers</span>!</p>
        <p>Yours algorithmically,</p>
        <p>The CRIS Hackathon Curators</p>
    </div>
</body>
</html>

        
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
    });

    console.log('OTP sent successfully:', otpcode); 
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}

module.exports = sendOtp;
