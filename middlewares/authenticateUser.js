const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if(scheme !== "Bearer" || !token){
        return res.status(401).json(
            {error: "Missing or malformed Authorization token!"}
        );
    }

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: payload.id, isAuthor: payload.isAuthor};
        next();
    }catch(err){
        const message = err.name === "TokenExpiredError" ? "Token expired." : "Invalid token.";
        res.status(401).json({ error: message });
    }
};

function requireAuthor(req, res, next) {
  if (!req.user || !req.user.isAuthor) {
    return res.status(403).json({ error: "Author access required." });
  }
  next();
}

module.exports = {isAuthenticated, requireAuthor};