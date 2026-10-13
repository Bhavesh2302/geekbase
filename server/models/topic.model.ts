import { Schema, model, Document, Model, Types } from 'mongoose';

export interface ITopic {
  chapterId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopicDocument extends ITopic, Document {}

const topicSchema = new Schema<ITopicDocument>(
  {
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: 'Chapter',
      required: [true, 'Chapter ID reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Topic slug is required'],
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
      required: [true, 'Topic order is required'],
      default: 0,
      min: [0, 'Order cannot be negative'],
    },
  },
  {
    timestamps: true,
    collection: 'topics',
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// Indexes
// Compound index for efficient ordered retrieval of topics within a chapter
topicSchema.index({ chapterId: 1, order: 1 });
topicSchema.index({ chapterId: 1, slug: 1 }, { unique: true });

export const Topic: Model<ITopicDocument> = model<ITopicDocument>('Topic', topicSchema);
