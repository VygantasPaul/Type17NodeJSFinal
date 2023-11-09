import jwt from "jsonwebtoken";

const authentificate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "No token provided" }); // 401 jei bandom paduodi bet nera pateikiama
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { /// patvirtinam tokena
        if (err) {
            return res.status(403).json({ response: "Wrong user login data" }) /// 403 failed to authentificate
        }
        return next()
    })
}
export default authentificate;
