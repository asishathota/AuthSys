import User from "../models/user.model.js";


export const delAccountMiddleware = async (req, res, next) => {
    try {
        const email = res.email;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: "fail",
                msg: "user doesnt exists"
            })
        }

        next()
    } catch (error) {
        console.error("Error in delete account: ", error);
        return res.status(400).json({
            status: "fail",
            msg: "an error has occured in delete account"
        })
    }
}