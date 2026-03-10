import { useState, useMemo, ReactNode } from "react";
import { Book } from "../data/books";
import { Input } from "./ui/input";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";

interface BookListProps {
  books: Book[];
}

interface ExpandableBoxProps {
  title: string;
  children: ReactNode;
}

function ExpandableBox({ title, children }: ExpandableBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden bg-muted/10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors text-left"
      >
        <span className="font-medium">{title}</span>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-muted-foreground/10 bg-background/50 animate-in fade-in slide-in-from-top-1 duration-200 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
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
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Bøger</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedBooks.length} {filteredAndSortedBooks.length === 1 ? "bog" : "bøger"} fundet
          </p>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border border-muted-foreground/10 space-y-3">
          <p className="text-sm md:text-base leading-relaxed">
            Dette er en samling af bøger, der spænder over mange forskellige genrer og emner. 
            Samlingen indeholder alt fra faglitteratur og klassikere til moderne skønlitteratur.
          </p>
          <a 
            href="https://photos.app.goo.gl/RxiK36Hwr8CJec2dA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Se billeder af alle bøgerne i Google Photos-albummet
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <ExpandableBox title="Den Store C++ & Systemarkitektur-pakke (~40 bøger)">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dette er uden tvivl samlingens tungeste og mest værdifulde pakke rent teknisk. Den dækker alt fra de helt lave lag i operativsystemet til de mest avancerede C++ templates.
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
            <li><strong>Kernen:</strong> Den komplette samling af <strong>Bjarne Stroustrup, Scott Meyers, Herb Sutter</strong> og <strong>Andrei Alexandrescu</strong>.</li>
            <li><strong>Netværk & System:</strong> Hele <strong>W. Richard Stevens'</strong> katalog (<em>TCP/IP Illustrated, Unix Network Programming</em>) samt <strong>Tanenbaums</strong> klassikere om operativsystemer og netværk.</li>
            <li><strong>Biblioteker & Patterns:</strong> Alt om <strong>Boost, STL, CORBA, ACE</strong> og de klassiske <strong>Design Patterns</strong> (GoF).</li>
            <li><strong>Hvorfor købe den?</strong> Fordi den indeholder stort set alt, hvad der er skrevet af betydning om C++ og systemprogrammering de sidste 30 år.</li>
          </ul>
        </ExpandableBox>

        <ExpandableBox title="Den Ultimative Agile & Software Leadership-pakke (~35 bøger)">
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            Denne pakke er skræddersyet til den moderne it-organisation, tech-leads eller Scrum Masters. Den handler mindre om kode og mere om, hvordan man bygger kvalitet og værdi.
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
            <li><strong>Processer:</strong> En massiv samling af <strong>Mike Cohn, Kent Beck</strong> og <strong>Gojko Adzic</strong>. Alt om Scrum, XP, User Stories, BDD og Retrospectives.</li>
            <li><strong>Software Design & Kvalitet:</strong> Klassikere som <strong>Martin Fowlers</strong> <em>Refactoring</em>, <strong>Steve McConnells</strong> <em>Code Complete</em> og <strong>Michael Nygards</strong> <em>Release It!</em>.</li>
            <li><strong>Startup & Ledelse:</strong> Moderne klassikere som <em>The Lean Startup</em>, <em>Rework</em>, <em>The Mom Test</em> og <strong>Joel on Software</strong>.</li>
            <li><strong>Hvorfor eje den?</strong> Den fungerer som en komplet "opskrift" på, hvordan man kører et succesfuldt softwareteam fra idé til produktion.</li>
          </ul>
        </ExpandableBox>

        <ExpandableBox title="Open Source, Infrastructure & Full-Stack-pakken (~45 bøger)">
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            Den perfekte pakke til DevOps-engineeren eller Full-stack-udvikleren. Den er præget af de ikoniske O'Reilly "dyrebøger" og dækker hele økosystemet omkring moderne webudvikling.
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed list-disc list-inside space-y-1">
            <li><strong>Sprog & Web:</strong> Komplette serier om <strong>Python, Perl, JavaScript</strong> (inkl. Flanagan og Stefanov) samt <strong>RESTful API'er</strong> og <strong>Ajax</strong>.</li>
            <li><strong>Infrastruktur & Ops:</strong> Alt om <strong>Git, Subversion, Docker, Vagrant, DNS & BIND, SSH</strong> og <strong>Network Security</strong>.</li>
            <li><strong>Data:</strong> Dybdegående guides til <strong>MySQL, PostgreSQL</strong> og <strong>Data Warehousing</strong>.</li>
            <li><strong>Kultur & Licensering:</strong> De vigtige værker om Open Source-filosofi og jura (Stallman, Raymond, Lessig).</li>
            <li><strong>Hvorfor eje den?</strong> Fordi den dækker de praktiske værktøjer, der holder internettet kørende hver eneste dag.</li>
          </ul>
        </ExpandableBox>
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