import mongoose, { Schema, Document } from 'mongoose';

export interface OrganizationDocument extends Document {
  name: string;
  description: string;
  address: string;
}

const OrganizationSchema = new Schema<OrganizationDocument>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = {
  model: Organization,
};
