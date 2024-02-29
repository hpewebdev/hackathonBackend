const axios = require('axios');
const https = require('https'); // Import https for proxy configuration

async function sendMessageToMobileNumber(mobileNumber, message) {
  const apiUrl = 'http://202.87.33.165/GatewayAPI/rest';
  const userId = '2000199659';
  const password = 'vTxpzEAh';
  const proxyUrl = 'http://172.16.1.61:8080'; // Define proxy URL

  try {
    // Create a custom agent for proxy configuration
    const agent = new https.Agent({
      proxy: {
        host: proxyUrl,
        port: 8080,
      },
    });

    const response = await axios.get(apiUrl, {
      params: {
        method: 'SendMessage',
        send_to: mobileNumber,
        msg: message,
        msg_type: 'TEXT',
        userid: userId,
        auth_scheme: 'plain',
        password: password,
        v: '1.1',
        format: 'text',
      },
      httpsAgent: agent, // Use the custom agent with proxy
    });

    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}

module.exports = sendMessageToMobileNumber;
