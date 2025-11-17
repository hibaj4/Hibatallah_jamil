import { Router } from 'express';
import { BookModel } from '../models/BookModel';

const router = Router();

router.get('/', async (req, res) => {
  const books = await BookModel.find().sort({ createdAt: -1 }).lean();
  res.json(books);
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (data.pagesRead > data.pages) data.pagesRead = data.pages;
    const book = new BookModel(data);
    await book.save();
    res.status(201).json(book);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await BookModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const d = await BookModel.findByIdAndDelete(req.params.id);
  if (!d) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'deleted' });
});

export default router;
