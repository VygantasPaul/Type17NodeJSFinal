import UserModel from '../model/user.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';


const REGISTER_USER = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt) // uzhesinam sinchroniniu budu paimam musu psw ir uzencriptinam
        const firstLetter = req.body.name.charAt(0);
        const uppercaseLetter = firstLetter.toUpperCase();

        const remainingLetters = req.body.name.slice(1);
        const capitalizedName = uppercaseLetter + remainingLetters;

        const user = new UserModel({
            name: capitalizedName,
            email: req.body.email,
            password: hash,
            bought_tickets: req.body.bought_tickets,
            money_balance: req.body.money_balance
        })
        user.id = user._id;

        const userRespone = await user.save();
        return res.status(201).json({ userRespone, response: "User registered" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ response: "Internal server error" })
    }
}
const LOGIN_USER = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ response: "User not found" })
        }

        bcrypt.compare(req.body.password, user.password, (error, isAuthMatch) => {
            if (error || !isAuthMatch) {
                return res.status(401).json({ response: "Wrong email or password" })
            }

            const token = jwt.sign({  /// uzencriptinam ir Token sukurimas
                email: user.email,
                userId: user.id

            }, process.env.JWT_SECRET, // tam tikras secret pagal kuri hashiname
                { expiresIn: "2h" },
                { algorithm: "RS256" },
            );
            const resfreshToken = jwt.sign({
                email: user.email,
                userId: user.id

            }, process.env.JWT_SECRET,
                { expiresIn: "24h" },
                { algorithm: "RS256" },
            );
            return res.status(200).json({ token, resfreshToken, response: "User logged in" })

        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ response: "User not logged in" })
    }
}

const ALL_USERS = async (req, res) => {
    try {
        const user = await UserModel.find();
        const filterUsers = user.sort((a, b) => a.name.localeCompare(b.name));
        return res.status(200).json({ filterUsers, response: "All users" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ response: "Something went wrong" });
    }
};

const GET_USER_BY_ID = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ user, response: "User not exist" })
        }
        return res.status(200).json({ user, response: "User was found" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ response: "Something wrong" })
    }
}
const USER_BY_ID_EDIT = async (req, res) => {
    try {
        const user = await UserModel.updateOne({ id: req.params.id }, { ...req.body })
        if (!user) {
            return res.status(404).json({ response: "User was not found" })
        }
        return res.status(200).json({ user, response: "User was updated" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ response: "Something wrong" })
    }
}
const USER_BY_ID_DELETE = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({ user, response: "User not exist" })
        }
        return res.status(200).json({ user, response: "User was deleted" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ response: "Something wrong" })
    }
}
const GET_USERS_WITH_TICKETS = async (req, res) => {
    try {
        const userTickets = await UserModel.aggregate([
            {
                $lookup: {
                    from: "tickets",
                    localField: "bought_tickets",
                    foreignField: "id",
                    as: "bought_tickets_data"
                }

            },

        ])
        const userTicketsData = userTickets.filter(user => user.bought_tickets_data.length > 0);
        return res.status(200).json({ userTicketsData, response: "Users with tickets" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ response: 'Failed to fetch users with tickets' });
    }

}
const GET_USER_ID_WITH_TICKETS = async (req, res) => {
    try {
        const user = await UserModel.aggregate([
            {
                $lookup: {
                    from: "tickets",
                    localField: "bought_tickets",
                    foreignField: "id",
                    as: "bought_tickets_data"
                }
            },
            { $match: { id: (req.params.id) } }
        ])

        if (user.length > 0 && user[0].bought_tickets_data.length > 0) {
            return res.status(200).json({ user, response: "User has a ticket" });
        } else {
            return res.status(404).json({ response: "User does not have any tickets" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ response: 'Failed to fetch users with user id with ticket' });
    }
}
export { REGISTER_USER, ALL_USERS, LOGIN_USER, GET_USER_BY_ID, GET_USERS_WITH_TICKETS, GET_USER_ID_WITH_TICKETS, USER_BY_ID_EDIT, USER_BY_ID_DELETE }