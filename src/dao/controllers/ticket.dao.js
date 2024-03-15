import ticket from "../models/ticket.model.js";
import userModel from "../models/users.model.js";


class TicketService {
  constructor() {}

  async getTickets() {
    return await ticket
      .find()
      .populate({ path: "purchaser", select: "-password", model: userModel })
      .lean();
  }

  async addTicket(ticket) {
    return await ticketModel.create(ticket);
  }
}

export default TicketService;