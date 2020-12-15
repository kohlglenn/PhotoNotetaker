import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User, UserDocument } from './models/User';
const cors = require('cors');

import users from './routes/api/users';
import feed from './routes/api/feed';

// initialize configuration
dotenv.config();
const port = process.env.PORT;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI as string, { useNewUrlParser: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));

const app: Express = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SESSION_SECRET
    },
    (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    }
  )
);

app.options('*', cors());
app.use(cors());

// define a route handler for the default home page
app.get('/', (req: Request, res: Response) => {
  res.send('<h1> Hello World </h1>');
});

app.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response) => {
    res.send(req.user);
  }
);

// routes
app.use('/api/users', users);
app.use('/api/feed', feed);

// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
