function otpcode(length = 6) {
    if (!Number.isInteger(length) || length < 1) {
      throw new Error('Length must be a positive integer.');
    }
  
    // Generate a random string of digits
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += Math.floor(Math.random() * 10);
    }
  
    if (randomString[0] === '0' && length > 1) {
      randomString = Math.floor(Math.random() * 10) + randomString.slice(1);
    }
  
    return parseInt(randomString);
  }
  
  module.exports = otpcode;
   
 
  