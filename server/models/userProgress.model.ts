import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IUserProgress {
  userId: Types.ObjectId;
  problemId: Types.ObjectId;
  isCompleted: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProgressDocument extends IUserProgress, Document {}

const userProgressSchema = new Schema<IUserProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem ID reference is required'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'user_progress',
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// Indexes
// Unique compound index ensures idempotency: each user has at most one progress entry per problem
userProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });
// Supporting index for querying all completed problems for a user (learning statistics / dashboard)
userProgressSchema.index({ userId: 1, isCompleted: 1 });

export const UserProgress: Model<IUserProgressDocument> = model<IUserProgressDocument>(
  'UserProgress',
  userProgressSchema
);
