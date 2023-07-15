const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
module.exports = [
    helmet(),
    bodyParser.json(),
    morgan(':remote-addr :remote-user ":method :url HTTP/:http-version" :status :res[content-length] [:date[clf]] :req[header]'),
    cors(),
]