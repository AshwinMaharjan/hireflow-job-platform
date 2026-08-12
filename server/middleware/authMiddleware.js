const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Not authorized. Invalid token."
        });
    }
};

const recruiterOnly = (req, res, next) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Access denied. Recruiters only."
        });
    }

    next();
};

const candidateOnly = (req, res, next) => {
    if (req.user.role !== "candidate") {
        return res.status(403).json({
            message: "Access denied. Candidates only."
        });
    }

    next();
};

module.exports = {
    protect,
    recruiterOnly,
    candidateOnly
};