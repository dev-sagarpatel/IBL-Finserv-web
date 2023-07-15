const md5 = require("md5");
module.exports = {
  login: async (req, res) => {
    try {
      var { email, password } = req.body;
      password = md5(password);

      let user = await framework.services.auth.authentication.login(
        email,
        password
      );
      if (!user) {
        return res.status(404).send({
          message: "User not found",
          error: true,
          data: {},
        });
      } else {
        user = JSON.parse(JSON.stringify(user));
        let { accessToken } = framework.functions.jwt.getAccessToken(user);
        let { refreshToken } = framework.functions.jwt.getRefreshToken(user);
        let exp = framework.functions.jwt.expiresIn(accessToken);
        user = {
          ...user,
          accessToken,
          refreshToken,
          exp,
        };
        return res.send({
          message: "",
          error: false,
          data: user,
        });
      }
    } catch (e) {
      return res.status(400).send({
        message: e.message,
        error: true,
        data: e.message,
      });
    }
  },
};
