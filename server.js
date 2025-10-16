const express = require('express');
const app = express();
app.use(express.json());

let libraryBooks = [
  { id: 1, title: "The Last Horizon", available: true },  // Changed book titles
  { id: 2, title: "Love and Lies", available: true },
  { id: 3, title: "Future Shock", available: false },
  { id: 4, title: "Cosmic Journey", available: false },
  { id: 5, title: "Twilight Realm", available: true },
  { id: 6, title: "Echoes of Tomorrow", available: true },
];

let members = [
  { id: 1, name: "Aarav", borrowedBooks: [] },
  { id: 2, name: "Bella", borrowedBooks: [] },
  { id: 3, name: "Chloe", borrowedBooks: [] },
  { id: 4, name: "Dylan", borrowedBooks: [] },
  { id: 5, name: "Eva", borrowedBooks: [] },
  { id: 6, name: "Finn", borrowedBooks: [] }
];

app.get('/', (req, res) => {
  res.send('Welcome to the Library API! Visit <a href="/library">/library</a> to see all books.');
});

app.get('/library', (req, res) => {
  let html = '<h1>Library Books</h1><ul>';

  libraryBooks.forEach(book => {
    let status = 'Available';
    if (!book.available) {
      const borrower = members.find(m => m.borrowedBooks.includes(book.id));
      if (borrower) status = `Borrowed by ${borrower.name}`;
      else status = 'Not Available';
    }

    html += `<li>
      <strong>${book.title}</strong> - ${status}
    </li>`;
  });

  html += '</ul>';
  res.send(html);
});

app.post('/members/:mid/borrow/:bid', (req, res) => {
  const member = members.find(m => m.id == req.params.mid);
  const book = libraryBooks.find(b => b.id == req.params.bid);
  if (!member || !book) return res.status(404).json({ msg: "Member or book not found" });
  if (!book.available) return res.status(400).json({ msg: "Book already borrowed" });
  book.available = false;
  member.borrowedBooks.push(book.id);
  res.json({ msg: "Book borrowed!", member, book });
});

app.post('/members/:mid/return/:bid', (req, res) => {
  const member = members.find(m => m.id == req.params.mid);
  const book = libraryBooks.find(b => b.id == req.params.bid);
  if (!member || !book) return res.status(404).json({ msg: "Member or book not found" });
  if (!member.borrowedBooks.includes(book.id)) return res.status(400).json({ msg: "Book not borrowed by member" });
  book.available = true;
  member.borrowedBooks = member.borrowedBooks.filter(id => id !== book.id);
  res.json({ msg: "Book returned!", member, book });
});

app.listen(3000, () => console.log("Server running on port 3000"));
