import jwt from "jsonwebtoken";

const refreshToken = (req, res, next) => {
    const refreshToken = req.headers.authorization;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token not provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid or expired refresh token. Please log in again.' });
        }

        req.body.userId = decoded.userId;

        const accessNewToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const accessRefreshToken = jwt.sign({ userId: decoded.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' });

        return res.status(200).json({ token: accessNewToken, refreshToken: accessRefreshToken, message: 'Token refreshed' });
    });
};

export default refreshToken;
