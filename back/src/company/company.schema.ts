import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

export interface Company extends mongoose.Document {
    readonly name: String;
    readonly description: String;
}


export class CompanyDTO  {
    readonly name: String;
    readonly description: String;
}
  