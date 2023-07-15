const jwt = require('jsonwebtoken')
module.exports = {
    getAccessToken: (user) => {
        var accessToken = jwt.sign(user, process.env.JWT_KEY, { expiresIn: 60 * 60 });
        return {accessToken}
    },
    getRefreshToken: (user) => {
        let refreshToken = jwt.sign({email: user.email}, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 })
        return { refreshToken }
    },
    verify: (token) => {
        return jwt.verify(token, process.env.JWT_KEY);
    },
    expiresIn: (token) => {
        const tokenElements = jwt.decode(token)
        // console.log(tokenElements)
        return tokenElements.exp
    },
    decode: (token) => {
        const decoded = jwt.decode(token)
        return decoded
    }
}