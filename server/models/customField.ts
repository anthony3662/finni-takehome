import { Schema, Document } from 'mongoose';

export interface CustomField {
  name: string; // The name of the custom field
  viewPermission: 'all' | 'doctor'; // The permission setting for who can view the field (all users or doctors only)
  value: string; // The value of the custom field
}

export interface CustomFieldDocument extends CustomField, Document {}

export const CustomFieldSchema = new Schema<CustomFieldDocument>({
  name: { type: String, required: true },
  viewPermission: { type: String, enum: ['all', 'doctor'], required: true },
  value: { type: String, required: true },
});

module.exports = {
  schema: CustomFieldSchema,
};
