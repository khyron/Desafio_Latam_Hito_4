const jwt = require("jsonwebtoken");

const isLogged = (req, res, next) => {
    const jwtSecret = process.env.JWT_SECRET || "secret";
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).send("NO TOKEN PROVIDED");
        return;
    }

    try {
        jwt.verify(token, jwtSecret);
        next();
    } catch (error) {
        res.status(401).send("INVALID TOKEN");
    }
};

module.exports = { isLogged };
