import { Schema, model, Document, Model, Types } from 'mongoose';

export type StudyPlanStatus = 'planned' | 'completed' | 'skipped';

/**
 * TIMEZONE POLICY:
 * In study planning and interactive calendar management (e.g., FullCalendar),
 * users assign problems to a specific calendar day in their local context.
 *
 * Storing scheduled dates as timestamp objects (e.g. UTC ISO 2026-10-15T00:00:00.000Z)
 * introduces boundary-shifting bugs when accessed across different client timezones
 * (e.g., UTC+05:30 IST vs UTC-08:00 PST shifts dates forward or backward by a day).
 *
 * POLICY SPECIFICATION:
 * 1. `scheduledDate` is stored strictly as a canonical `YYYY-MM-DD` string (e.g., "2026-10-15").
 * 2. It represents the calendar grid date selected by the student, invariant to server or client timezone conversions.
 * 3. System-generated `createdAt` and `updatedAt` remain UTC ISO Timestamps for auditing.
 */
export interface IStudyPlan {
  userId: Types.ObjectId;
  problemId: Types.ObjectId;
  scheduledDate: string; // Canonical YYYY-MM-DD format
  status: StudyPlanStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudyPlanDocument extends IStudyPlan, Document {}

const studyPlanSchema = new Schema<IStudyPlanDocument>(
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
    scheduledDate: {
      type: String,
      required: [true, 'Scheduled date is required'],
      match: [
        /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,
        'scheduledDate must be a canonical calendar date in YYYY-MM-DD format',
      ],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['planned', 'completed', 'skipped'],
        message: '{VALUE} is not a valid study plan status',
      },
      default: 'planned',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    collection: 'study_plans',
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// Indexes
// Compound index for querying a student's study calendar schedule efficiently
studyPlanSchema.index({ userId: 1, scheduledDate: 1 });
// Supporting index for querying all schedule history for a specific problem by user
studyPlanSchema.index({ userId: 1, problemId: 1 });

export const StudyPlan: Model<IStudyPlanDocument> = model<IStudyPlanDocument>(
  'StudyPlan',
  studyPlanSchema
);
