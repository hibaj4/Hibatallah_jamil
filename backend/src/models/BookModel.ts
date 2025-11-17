import { Schema, model, Document } from 'mongoose';

export type StatusType = 'Read' | 'Re-read' | 'DNF' | 'Currently reading' | 'Returned Unread' | 'Want to read';
export type FormatType = 'Print' | 'PDF' | 'Ebook' | 'AudioBook';

export interface IBook extends Document {
  title: string;
  author: string;
  pages: number;
  status: StatusType;
  price: number;
  pagesRead: number;
  format: FormatType;
  suggestedBy?: string;
  finished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true, min: 1 },
  status: { type: String, required: true, enum: ['Read','Re-read','DNF','Currently reading','Returned Unread','Want to read'] },
  price: { type: Number, required: true, min: 0 },
  pagesRead: { type: Number, required: true, min: 0 },
  format: { type: String, required: true, enum: ['Print','PDF','Ebook','AudioBook'] },
  suggestedBy: { type: String },
  finished: { type: Boolean, default: false }
}, { timestamps: true });

BookSchema.pre<IBook>('save', function(next) {
  this.finished = (this.pagesRead >= this.pages);
  if (this.pagesRead > this.pages) this.pagesRead = this.pages;
  next();
});

export const BookModel = model<IBook>('Book', BookSchema);
