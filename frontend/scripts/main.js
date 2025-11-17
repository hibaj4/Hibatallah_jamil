import { Book } from './book.js'; 

const API_BASE = 'http://localhost:4000';

const form = document.getElementById('bookForm');
const booksList = document.getElementById('booksList');
const totals = document.getElementById('totals');

async function loadBooks() {
  const resp = await fetch(`${API_BASE}/books`);
  const books = await resp.json();
  renderBooks(books);
  renderTotals(books);
}

function renderTotals(books) {
  const totalBooks = books.length;
  const totalFinished = books.filter(b => b.finished).length;
  const totalPages = books.reduce((s, b) => s + (b.pages || 0), 0);
  const totalPagesRead = books.reduce((s, b) => s + (b.pagesRead || 0), 0);

  totals.innerHTML = `
    <div>Livres au total: <strong>${totalBooks}</strong></div>
    <div>Livres terminés: <strong>${totalFinished}</strong></div>
    <div>Pages totales: <strong>${totalPages}</strong></div>
    <div>Pages lues: <strong>${totalPagesRead}</strong></div>
  `;
}

function renderBooks(books) {
  booksList.innerHTML = '';
  for (const b of books) {
    const book = new Book(b);
    const percent = book.currentlyAt();
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow flex justify-between items-center';
    card.innerHTML = `
      <div>
        <div class="font-semibold">${escapeHtml(b.title)} <span class="text-sm text-gray-500">by ${escapeHtml(b.author)}</span></div>
        <div class="text-sm text-gray-600">Format: ${b.format} • Status: ${b.status} • Price: ${b.price} €</div>
        <div class="text-sm text-gray-600 mt-2">Pages: ${b.pages} • Lues: ${b.pagesRead} (${percent}%)</div>
        <div class="mt-2">
          <label class="text-sm">Mettre à jour pages lues: </label>
          <input type="number" min="0" max="${b.pages}" value="${b.pagesRead}" data-id="${b._id}" class="p-1 ml-2 border rounded pages-input" style="width:100px" />
          <button data-id="${b._id}" class="update-btn ml-2 bg-green-600 text-white px-2 py-1 rounded text-sm">Update</button>
          <button data-id="${b._id}" class="delete-btn ml-2 bg-red-600 text-white px-2 py-1 rounded text-sm">Delete</button>
        </div>
      </div>
    `;
    booksList.appendChild(card);
  }

  // attach events
  document.querySelectorAll('.update-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const input = document.querySelector(`input.pages-input[data-id="${id}"]`);
      let newPagesRead = Number(input.value);
      if (isNaN(newPagesRead) || newPagesRead < 0) newPagesRead = 0;
      // call API
      const res = await fetch(`${API_BASE}/books/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ pagesRead: newPagesRead })
      });
      if (!res.ok) alert('Update failed');
      else loadBooks();
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('Supprimer ce livre ?')) return;
      const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
      if (!res.ok) alert('Delete failed');
      else loadBooks();
    });
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const payload = {
    title: fd.get('title'),
    author: fd.get('author'),
    pages: Number(fd.get('pages')),
    status: fd.get('status'),
    price: Number(fd.get('price')),
    pagesRead: Number(fd.get('pagesRead')),
    format: fd.get('format'),
    suggestedBy: fd.get('suggestedBy')
  };
  if (payload.pagesRead > payload.pages) payload.pagesRead = payload.pages;
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    alert('Erreur: ' + (err.error || 'unknown'));
  } else {
    form.reset();
    loadBooks();
  }
});

loadBooks();
