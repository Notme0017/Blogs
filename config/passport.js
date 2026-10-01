const passport = require("passport");
const bcrypt = require("./bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const {Strategy: JwtStrategy, ExtractJwt} = require("passport-jwt");

passpoprt.use(
    new LocalStrategy (async (username, password, done) =>{
        try{
            const user = await userQueries.getUserByUsername(username);

            if(!user) return done(null, false, {message: "Incorrect Username"});

            const match = await bcrypt.matchPassword(password, user.password);
            if(!match) return done(null, false, {message: "Incorrect Password!"});

            return done(null, user);
        }catch(err){
            return done(err);
        }
    })
);

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (payload, done) =>{
            try{
                const user = await userQueries.findUserById(payload.userId);
                return user? done(null, user): done(null, false);
            }catch(err){
                return done(err);
            }
        }
    )
)