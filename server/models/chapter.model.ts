import { Schema, model, Document, Model } from 'mongoose';

export interface IChapter {
  title: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChapterDocument extends IChapter, Document {}

const chapterSchema = new Schema<IChapterDocument>(
  {
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Chapter slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    order: {
      type: Number,
      required: [true, 'Chapter order is required'],
      default: 0,
      min: [0, 'Order cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'chapters',
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// Indexes
chapterSchema.index({ order: 1 });

export const Chapter: Model<IChapterDocument> = model<IChapterDocument>('Chapter', chapterSchema);
