import { Document, LeanDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;
export type LeanUserDocument = LeanDocument<UserDocument>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String, lowercase: true, trim: true })
  firstname: string;

  @Prop({ type: String, lowercase: true, trim: true })
  lastname?: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ type: String, trim: true })
  password?: string;

  @Prop({ type: String, trim: true })
  picture?: string;

  @Prop({ type: Boolean, default: false })
  isRegisteredWithGoogle: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
