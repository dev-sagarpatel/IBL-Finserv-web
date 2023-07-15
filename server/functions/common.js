module.exports = {
    generateOTP: function generateOTP(length = 4) {
        var digits = "0123456789";
        var OTP = "";
        for (let i = 1; i <= length; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
      
        if(OTP.startsWith('0')) {
          OTP = generateOTP(length)
        }
      
        return OTP;
    }
}