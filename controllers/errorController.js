const {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} = require("../generated/prisma");

function errorHandler(err, req, res, next){
    console.log(err);

    if(err instanceof PrismaClientValidationError){
        return res.status(400).json({
            error: "Invalid query parameters provided.",
        });
    }

    if(err instanceof PrismaClientKnownRequestError){
        if(err.code === 'P2002'){
            return res.status(409).json({
                error: "Unique constraint failed!"
            });
        }
    }

    res.status(500).json({
        error: "Internal Server Error. Please try again later."
    });
}

module.exports = errorHandler;