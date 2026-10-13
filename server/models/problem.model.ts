import { Schema, model, Document, Model, Types } from 'mongoose';

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface IProblemResources {
  youtubeUrl?: string | null;
  practiceUrl?: string | null;
  articleUrl?: string | null;
}

export interface IProblem {
  topicId: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  difficulty: ProblemDifficulty;
  order: number;
  resources: IProblemResources;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProblemDocument extends IProblem, Document {}

const problemResourcesSchema = new Schema<IProblemResources>(
  {
    youtubeUrl: {
      type: String,
      default: null,
      trim: true,
    },
    practiceUrl: {
      type: String,
      default: null,
      trim: true,
    },
    articleUrl: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { _id: false }
);

const problemSchema = new Schema<IProblemDocument>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic ID reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Problem slug is required'],
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty (must be Easy, Medium, or Hard)',
      },
    },
    order: {
      type: Number,
      required: [true, 'Problem order is required'],
      default: 0,
      min: [0, 'Order cannot be negative'],
    },
    resources: {
      type: problemResourcesSchema,
      default: () => ({
        youtubeUrl: null,
        practiceUrl: null,
        articleUrl: null,
      }),
    },
  },
  {
    timestamps: true,
    collection: 'problems',
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// Indexes
// Compound index for querying problems within a topic sorted by curriculum progression
problemSchema.index({ topicId: 1, order: 1 });
problemSchema.index({ topicId: 1, slug: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const Problem: Model<IProblemDocument> = model<IProblemDocument>('Problem', problemSchema);
