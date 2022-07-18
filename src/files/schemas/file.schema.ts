import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, LeanDocument } from 'mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type FileDocument = File & Document;
export type LeanFileDocument = LeanDocument<FileDocument>;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true, type: String, lowercase: true, trim: true })
  url: string;

  @Prop({ required: true, type: String, lowercase: true, trim: true })
  key: string;

  @Prop({ type: String, lowercase: true, trim: true })
  name: string;

  @Prop({ type: String, lowercase: true, trim: true })
  originalName: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User;
}

export const FileSchema = SchemaFactory.createForClass(File);
