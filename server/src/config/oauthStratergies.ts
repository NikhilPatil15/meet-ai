import { Strategy as GoogleStratergy, StrategyOptions} from "passport-google-oauth20";
import { Strategy as GithubStratergy } from "passport-github2";
import { handleOAuth } from "./handleOAuth";
import { githubId, githubSecret, googleId, googleSecret } from "./envConfig";


const googleStratergy = new GoogleStratergy(
  {
    clientID: googleId!,
    clientSecret:googleSecret!,
    callbackURL:'http://localhost:5000/api/v1/user/oauth/google/callback',
    passReqToCallback: true,
  } ,
  function (req: any, token: any, refreshToken: any, profile: any, cb: (err: any, user?: any) => void) {
    handleOAuth(req, profile, cb);
  }
);

const githubStratergy = new GithubStratergy(
    {
        clientID:githubId!,
        clientSecret:githubSecret!,
        callbackURL:`http://localhost:5000/api/v1/user/oauth/github/login`,
        passReqToCallback:true
    },
    function(req: any, token: any, refreshToken: any, profile: any, cb: (err: any, user?: any) => void ){
        handleOAuth(req, profile, cb)
    }
)

export{
    googleStratergy,
    githubStratergy
}