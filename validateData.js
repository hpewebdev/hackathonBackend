const con = require('./connection'); // Import the database connection

async function validateTeamData(data) {
  const errors = []; // Array to store error messages

  try {
    // Check for unique Team_Name:
    const existingTeam = await con.query('SELECT * FROM mst_team WHERE Team_Name = ?', [data.Team_Name]);
    if (existingTeam.length > 0) {
      errors.push('Team name already exists');
    }

    // Check for required fields:
    const requiredFields = ['Leader_First_Name', 'Leader_last_Name', 'Leader_Email', 'Leader_Project_Group'];
    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    }

    // Add more validation rules and error messages as needed

    if (errors.length > 0) {
      throw new Error('Validation failed: ' + errors.join(', ')); // Combine errors into a single message
    }

    return true; // Validation successful
  } catch (error) {
    console.error(error);
    return false; // Validation failed
  }
}

module.exports = { validateTeamData };
