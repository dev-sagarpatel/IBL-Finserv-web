module.exports = {
    tokenVerification: (req, res, next) => {
        const { authorization } = req.headers;
        // console.log(authorization, req.headers, ' <=== Auth token...')
        if(!authorization || !authorization.startsWith('Bearer')) {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        let token = authorization.replace('Bearer ', '');

        const decodedToken = framework.functions.jwt.verify(token)
        req.user = decodedToken
        return next();
    }
}