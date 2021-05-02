"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const secrets_1 = require("./util/secrets");
const passport_jwt_1 = require("passport-jwt");
const User_1 = require("./models/User");
const cors = require('cors');
const users_1 = __importDefault(require("./routes/api/users"));
const feed_1 = __importDefault(require("./routes/api/feed"));
const create_1 = __importDefault(require("./routes/api/create"));
// initialize configuration
dotenv_1.default.config();
const port = process.env.PORT;
// Connect to MongoDB
mongoose_1.default
    .connect(secrets_1.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB successfully connected'))
    .catch((err) => console.log(err));
const app = express_1.default();
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(req.headers);
//   next();
// });
// Middleware
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb' }));
app.use(passport_1.default.initialize());
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secrets_1.SESSION_SECRET
}, (jwt_payload, done) => {
    User_1.User.findById(jwt_payload.id)
        .then((user) => {
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    })
        .catch((err) => console.log(err));
}));
app.options('*', cors());
app.use(cors());
// define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('<h1> Hello World </h1>');
});
app.get('/protected', passport_1.default.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user);
});
// routes
app.use('/api/users', users_1.default);
app.use('/api/feed', feed_1.default);
app.use('/api/create', create_1.default);
// start the express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
