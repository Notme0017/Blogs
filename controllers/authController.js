const userQueries = require("../db/user.query");
const jwt = require("jsonwebtoken");
const bcrypt = require("../config/bcrypt");

exports.signUpUser = async (req, res, next) =>{
    try{
        const {username, password} = req.body;
    
        const hashedPassword = await bcrypt.hashPassword(password);

        const user = await userQueries.createUser(username, hashedPassword);

        res.status(201)
        .json({id: user.id, username: user.username});
    }catch(err){
        next(err);
    };
};

exports.signUpAuthor = async (req, res, next) =>{
    try{
        const{username, password, isAuthor} = req.body;

        const hashedPassword = await bcrypt.hashPassword(password);

        const user = await userQueries.createUser(username, hashedPassword, isAuthor);

        res.status(201)
        .json({id: user.id, username: user.username, isAuthor: user.isAuthor});
    }catch(err){
        next(err);
    }
}

exports.loginUser = async (req, res, next) =>{
    try{
        const { username, password } = req.body;

        const user = await userQueries.getUserByUsername(username);

        const ok = user && (await bcrypt.matchPassword(password, user.password));
        if(!ok){
            return res.status(401).json({
                error: "Username or Password is invalid!"
            });
        }

        const token = jwt.sign(
            {id: user.id, isAuthor: user.isAuthor},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.json({token});
    }catch(err){
        next(err);
    }
};

exports.currentUser = async(req, res, next) =>{
    try{
        const user = req.user;
        const response = await userQueries.getUserById(user.id);

        if(!response)return res.status(404).json({
            error: "User not found."
        });

        return res.status(200).json({
            user: response,
        })
    }catch(err){
        next(err);
    }
}