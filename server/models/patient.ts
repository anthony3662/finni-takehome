import mongoose, { Schema, Document } from 'mongoose';

export type PatientStatus = 'inquiry' | 'onboarding' | 'active' | 'churned';

export interface AddressDocument extends Document {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PatientDocument extends Document {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  organizationId: mongoose.Types.ObjectId;
  status: PatientStatus;
  addresses: AddressDocument[];
}

const addressSchema = new Schema<AddressDocument>({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
});

const PatientSchema = new Schema<PatientDocument>({
  firstName: {
    type: String,
    required: true,
    index: true,
  },
  middleName: {
    type: String,
    index: true,
  },
  lastName: {
    type: String,
    required: true,
    index: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  status: {
    type: String,
    required: true,
    index: true,
    enum: ['inquiry', 'onboarding', 'active', 'churned'],
  },
  addresses: {
    type: [addressSchema],
    required: true,
    default: [],
  },
});

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = {
  model: Patient,
};
