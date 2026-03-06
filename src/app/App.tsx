import { BookList } from "./components/BookList";
import { books } from "./data/books";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <BookList books={books} />
    </div>
  );
}