import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    authOId: { type: String, required: true },
    company: {type: String, required: true},
});

export interface User extends mongoose.Document {
    readonly name: String;
    readonly type: String;
    readonly authOId: String;
    readonly company: String;
}


export class UserDTO  {
    readonly name: String;
    readonly type: String;
    readonly authOId: String;
    readonly company: String;
}
  