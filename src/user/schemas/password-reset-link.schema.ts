import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, LeanDocument } from 'mongoose';

export type PasswordResetLinkDocument = PasswordResetLink & Document;
export type LeanPasswordResetLinkDocument =
  LeanDocument<PasswordResetLinkDocument>;

@Schema({ timestamps: true })
export class PasswordResetLink {
  @Prop({
    required: true,
    type: String,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: Date,
    expires: '60m',
    default: Date.now,
  })
  expireDate: Date;
}

export const PasswordResetLinkSchema =
  SchemaFactory.createForClass(PasswordResetLink);
