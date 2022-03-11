/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response }  from "express";
import passport from "passport";
// @ts-ignore
import GoogleStrategy from "passport-google-oidc";
import * as dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/api/auth/oauth2/redirect/google',
  scope: [ 'profile' ]
}, (issuer: any, profile: any, cb: any) => {
  console.log(issuer);
  console.log(profile);
  cb(null, profile);
}))

passport.serializeUser(function(user: any, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user: any, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

/**
* Router Definition
*/

export const authRouter = express.Router();

/**
* Controller Definitions
*/

// GET login page
authRouter.get("/login", async (req: Request, res: Response) => {
  console.log('is logged in:' + req.isAuthenticated());
  res.status(200).send('login');
});

authRouter.get("/success", async (req: Request, res: Response) => {
  res.status(200).send('logged in!');
});

// Google strategy
authRouter.get('/login/federated/google', passport.authenticate('google'));

authRouter.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/api/auth/success',
  failureRedirect: '/api/auth/login'
}));

authRouter.get('/logout', async (req: Request, res: Response) => {
  req.logout();
  console.log('logout');
  res.redirect('/api/auth/login');
});