import TicketModel from '../model/ticket.js';
import UserModel from '../model/user.js';
const ADD_TICKET = async (req, res) => {
    try {
        const ticket = new TicketModel({
            title: req.body.title,
            ticket_price: req.body.ticket_price,
            from_location: req.body.from_location,
            to_location: req.body.to_location,
            to_location_photo_url: req.body.to_location_photo_url,
        })
        ticket.id = ticket._id;
        const response = await ticket.save();

        return res.status(201).json({ response, status: "New ticket" })
    } catch (err) {
        return res.status(500).json({ status: "Somthing wrong" })
    }

}

const ALL_TICKETS = async (req, res) => {
    try {
        const user = await TicketModel.find();
        return res.status(200).json({ user, status: "All tickets" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "Something wrong" })
    }
}
const GET_TICKET_ID = async (req, res) => {
    try {
        const ticket = await TicketModel.findById(req.params.id);
        return res.status(200).json({ ticket, response: "Ticket ID" })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ response: "Something wrong" })
    }
}
const REMOVE_TICKET = async (req, res) => {
    try {
        const ticket = await TicketModel.findByIdAndDelete(req.params.id)
        if (!ticket) {
            return res.status(404).json({ ticket, response: "Ticket not exist" })
        }
        return res.status(200).json({ ticket, response: "Ticket was deleted" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ response: "Something wrong" })
    }
}
const BUY_TICKET_TO_USER = async (req, res) => {
    try {
        const ticket = await TicketModel.findById(req.params.id);
        const user = await UserModel.findById(req.body.userId);

        if (!ticket) {
            return res.status(404).json({ status: "Ticket not found" });
        }
        if (!user) {
            return res.status(404).json({ status: "User not found" });
        }

        const roundedMoneyBalance = parseFloat(user.money_balance.toFixed(2));
        const roundedTicketPrice = parseFloat(ticket.ticket_price.toFixed(2));


        if (roundedTicketPrice > roundedMoneyBalance) {
            return res.status(400).json({ response: "Ticket too expensive" });
        }

        if (user.bought_tickets.includes(ticket.id)) {

            return res.status(400).json({ response: "User already bought this ticket" });
        } else {
            try {
                await UserModel.updateOne(
                    { id: req.body.userId },
                    { $push: { bought_tickets: ticket.id } }
                );
                console.log(req.body)
                const updatedUser = await UserModel.findById(req.body.userId);

                if (updatedUser) {
                    updatedUser.money_balance = parseFloat((updatedUser.money_balance - ticket.ticket_price).toFixed(2));
                    await updatedUser.save();
                    return res.status(201).json({ updatedUser, response: "Ticket added to user" });
                }
            } catch (error) {
                console.error(error);
                return res.status(400).json({ response: "Something went wrong" });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ response: "Failed to buy ticket " });
    }
};
const REMOVE_TICKET_FROM_USER = async (req, res) => {
    try {
        const ticket = await TicketModel.findById(req.params.id);
        const user = await UserModel.findById(req.body.userId);

        if (!ticket) {
            return res.status(404).json({ status: "Ticket not found" });
        }

        if (!user) {
            return res.status(404).json({ status: "User not found" });
        }

        if (!user.bought_tickets.includes(ticket.id)) {
            return res.status(404).json({ response: "User has not bought this ticket" });
        } else {
            try {
                await UserModel.updateOne(
                    { id: req.body.userId },
                    { $pull: { bought_tickets: ticket.id } }
                );
                const updatedUser = await UserModel.findById(req.body.userId);

                if (updatedUser) {
                    updatedUser.money_balance = parseFloat((updatedUser.money_balance + ticket.ticket_price).toFixed(2));
                    await updatedUser.save();
                    return res.status(200).json({ updatedUser, response: "Ticket removed from user" });
                }
            } catch (error) {
                console.error(error);
                return res.status(400).json({ response: "Something went wrong" });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ response: "Failed to remove ticket" });
    }
};


export { ADD_TICKET, ALL_TICKETS, GET_TICKET_ID, BUY_TICKET_TO_USER, REMOVE_TICKET_FROM_USER, REMOVE_TICKET }