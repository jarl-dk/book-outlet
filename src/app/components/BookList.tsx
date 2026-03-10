import { useState, useMemo } from "react";
import { Book } from "../data/books";
import { Input } from "./ui/input";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

interface BookListProps {
  books: Book[];
}

type SortKey = keyof Book;
type SortDirection = "asc" | "desc" | null;

export function BookList({ books }: BookListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleBookClick = (isbn: string) => {
    // Remove hyphens from ISBN for Amazon URL
    const cleanIsbn = isbn.replace(/-/g, "");
    const amazonUrl = `https://www.amazon.co.uk/s?k=${cleanIsbn}`;
    window.open(amazonUrl, "_blank", "noopener,noreferrer");
  };

  const filteredAndSortedBooks = useMemo(() => {
    // First filter
    let result = books;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = books.filter((book) => {
        return (
          book.titel.toLowerCase().includes(search) ||
          book.forfattere.toLowerCase().includes(search) ||
          book.forlag.toLowerCase().includes(search) ||
          book.isbn13.toLowerCase().includes(search) ||
          book.år.toLowerCase().includes(search)
        );
      });
    }

    // Then sort
    if (sortKey && sortDirection) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        
        const comparison = aValue.localeCompare(bValue, 'da');
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [books, searchTerm, sortKey, sortDirection]);

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    }
    return <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Bogbibliotek</h1>
        <p className="text-muted-foreground">
          {filteredAndSortedBooks.length} {filteredAndSortedBooks.length === 1 ? "bog" : "bøger"} fundet
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Søg efter titel, forfatter, forlag, ISBN-13 eller år..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-muted transition-colors select-none"
                  onClick={() => handleSort("titel")}
                >
                  <div className="flex items-center gap-2">
                    Titel
                    {getSortIcon("titel")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-muted transition-colors select-none"
                  onClick={() => handleSort("forfattere")}
                >
                  <div className="flex items-center gap-2">
                    Forfatter(e)
                    {getSortIcon("forfattere")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-muted transition-colors select-none"
                  onClick={() => handleSort("forlag")}
                >
                  <div className="flex items-center gap-2">
                    Forlag
                    {getSortIcon("forlag")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-muted transition-colors select-none"
                  onClick={() => handleSort("isbn13")}
                >
                  <div className="flex items-center gap-2">
                    ISBN-13
                    {getSortIcon("isbn13")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-muted transition-colors select-none"
                  onClick={() => handleSort("år")}
                >
                  <div className="flex items-center gap-2">
                    År
                    {getSortIcon("år")}
                  </div>
                </th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredAndSortedBooks.map((book, index) => (
                <tr
                  key={`${book.isbn13}-${index}`}
                  className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  onClick={() => handleBookClick(book.isbn13)}
                >
                  <td className="px-4 py-3">{book.titel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{book.forfattere}</td>
                  <td className="px-4 py-3 text-muted-foreground">{book.forlag}</td>
                  <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                    {book.isbn13}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{book.år}</td>
                  <td className="px-4 py-3">
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedBooks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Ingen bøger fundet med søgningen "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}