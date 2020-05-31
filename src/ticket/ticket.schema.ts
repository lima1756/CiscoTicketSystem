import * as mongoose from 'mongoose';
import Comment from '../types/Comment.type'

export const TicketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true },
    user: { type: String, required: true},
    company: { type: String, required: true},
    public: { type: Boolean, required: true},
    comments: { type: mongoose.Schema.Types.Array, required: false, default: []},
    date: {type: Date, required: false, default: Date.now()}
});

export interface Ticket extends mongoose.Document {
    readonly title: String;
    readonly description: String;
    readonly priority: String;
    readonly status: String;
    readonly type: String;
    readonly user: String;
    readonly company: String;
    readonly public: Boolean;
    readonly comments: Array<Comment>;
    readonly date: Date;
}


export class TicketDTO  {
    readonly title: String;
    readonly description: String;
    readonly priority: String;
    readonly status: String;
    readonly type: String;
    readonly user: String;
    readonly company: String;
    readonly public: Boolean;
    readonly comments: Array<Comment>;
    readonly date: Date;
}
  