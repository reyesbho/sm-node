import { validateUser } from "../schemas/user.js";

export class UserController {
    constructor({ userModel }) {
        this.userModel = userModel;
    }

    create = async (req, res) => {
        const result = validateUser(req.body);
        if (result.error) {
            return res.status(400).json({ message: JSON.parse(result.error.message) });
        }
        try {
            const newUser = await this.userModel.create( result.data );
            return res.json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}