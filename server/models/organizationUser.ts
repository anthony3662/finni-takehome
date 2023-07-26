import mongoose, { Schema, Document } from 'mongoose';

export interface OrganizationUserDocument extends Document {
  email: string;
  organizationId: mongoose.Types.ObjectId;
  role: 'doctor' | 'clerk';
}

const OrganizationUserSchema = new Schema<OrganizationUserDocument>({
  email: {
    type: String,
    required: true,
    index: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const OrganizationUser = mongoose.model(
  'OrganizationUser',
  OrganizationUserSchema
);

module.exports = {
  model: OrganizationUser,
};
