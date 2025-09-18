import jwt from 'jsonwebtoken'

export const checkTokenMiddleware = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        const accessToken = bearerToken && bearerToken.split(" ")[1]

        const decoded = jwt.verify(accessToken, process.env.JWT_PASS)

        if (decoded) {
            res.email = decoded.email;
            next()
        }
    } catch (error) {
        console.error("Error in checking token:", error.message)
        res.status(401).json({
            status: "fail",
            msg: error.message
        })
    }
}