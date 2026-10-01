const bcrypt = require("bcryptjs");

async function hashPassword (password){
    return await bcrypt.hash(password, 10);
};

async function matchPassword(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
};

module.exports = {hashPassword, matchPassword};