"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const secrets_1 = require("./util/secrets");
const cors = require('cors');
// initialize configuration
dotenv_1.default.config();
const port = process.env.PORT;
// Connect to MongoDB
mongoose_1.default
    .connect(secrets_1.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB successfully connected'))
    .catch((err) => console.log(err));
const app = express_1.default();
// // app.use((req: Request, res: Response, next: NextFunction) => {
// //   console.log(req.headers);
// //   next();
// // });
// // Middleware
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb' }));
// app.use(passport.initialize());
// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: SESSION_SECRET
//     },
//     (jwt_payload, done) => {
//       User.findById(jwt_payload.id)
//         .then((user) => {
//           if (user) {
//             return done(null, user);
//           }
//           return done(null, false);
//         })
//         .catch((err) => console.log(err));
//     }
//   )
// );
// app.options('*', cors());
// app.use(cors());
// define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('<h1> Hello World </h1>');
});
// app.get(
//   '/protected',
//   passport.authenticate('jwt', { session: false }),
//   (req: Request, res: Response) => {
//     res.send(req.user);
//   }
// );
// // routes
// app.use('/api/users', users);
// app.use('/api/feed', feed);
// app.use('/api/create', create);
// start the express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
