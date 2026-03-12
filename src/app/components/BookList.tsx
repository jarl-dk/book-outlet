import { Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useMemo, ReactNode } from "react";
import { Book } from "../data/books";
import CopyButton from "./ui/copy-button";
import { Input } from "./ui/input";

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
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/20 border-primary/30 bg-muted/20 shadow-lg' : 'bg-muted/10 hover:bg-muted/15 border-muted-foreground/10 shadow-sm'}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-primary/5 transition-colors text-left group"
      >
        <span className={`font-semibold text-lg transition-colors ${isExpanded ? 'text-primary' : 'text-foreground group-hover:text-primary/80'}`}>{title}</span>
        <div className={`p-1 rounded-full transition-all duration-300 ${isExpanded ? 'bg-primary text-primary-foreground rotate-180' : 'bg-muted-foreground/10 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>
      {isExpanded && (
        <div className="p-6 border-t border-muted-foreground/10 bg-background/40 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
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
    // 1. Tjek om brugeren har markeret tekst
    const selection = window.getSelection();

    // Hvis selection.toString() ikke er tom, betyder det, at brugeren
    // er i gang med at markere tekst – så skal vi IKKE navigere.
    if (selection && selection.toString().length > 0) {
      return;
    }

    // 2. Hvis ingen tekst er markeret, fortsæt som normalt
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
          book.emne.toLowerCase().includes(search) ||
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
    <div className="w-full max-w-7xl mx-auto p-6 md:p-10 space-y-12">
      <div className="space-y-8">
        <div className="space-y-4 border-b pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 pb-2">
            Premium Bogsamling
          </h1>
        </div>

        <div className="flex justify-center">
          <div className="max-w-4xl w-full bg-amber-100 border-2 border-amber-300 text-amber-900 px-6 py-6 rounded-xl shadow-md text-center space-y-4">
            <p className="text-xl md:text-2xl font-black uppercase tracking-widest italic">
              Jeg giver det <span className="line-through decoration-amber-600/60 decoration-4">hele</span> meste væk
            </p>
            <p className="text-base md:text-lg font-medium leading-relaxed">
              Jeg rydder ud i min bogsamling. Jeg skal af med ca. 95% af de næsten 400 bøger. Det skal væk inden starten af april (2026). Hvis du er interesseret, så kontakt mig.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-muted/40 via-muted/20 to-background p-8 md:p-12 rounded-2xl border border-primary/10 shadow-xl flex justify-center">
          <div className="max-w-4xl w-full text-base md:text-lg leading-relaxed text-muted-foreground/90 italic">
            Dette projekt har jeg lavet sammen med min søn som et vibe-coding projekt. Boglisten er lavet af Gemini ud fra billeder af bogreolen. Texterne der beskriver bogsamlingen er formuleret af Gemini. Koden er skabt af AI blandt via Figma og Webstorm Junie.
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-muted/40 via-muted/20 to-background p-8 md:p-12 rounded-2xl border border-primary/10 shadow-xl flex justify-center">
          <div className="max-w-4xl space-y-6 relative w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
              Det Ultimative Bibliotek til Softwareingeniøren og IT-Arkitekten
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground/90">
              <p className="text-base md:text-lg leading-relaxed italic">
                Er du på udkig efter at bygge (eller fuldende) det perfekte tekniske opslagsværk? Her udbydes en massiv og kurateret bogsamling, der spænder over otte hylder af ren it-historie og teknisk dybde.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                Dette er ikke blot "gamle computerbøger" – det er de fundamentale værker, som moderne software er bygget på. Samlingen er ideel til den seriøse udvikler, studerende, eller som et imponerende referencebibliotek til kontoret.
              </p>
            </div>

            <div className="bg-background/40 backdrop-blur-sm p-6 rounded-xl border border-primary/5 space-y-4 shadow-inner">
              <h3 className="text-lg font-bold flex items-center gap-2 text-primary">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Højdepunkter i samlingen:
              </h3>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm md:text-base leading-relaxed text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>De Store Klassikere:</strong> Knuth's <em>Art of Programming</em> & K&R <em>The C Programming Language</em>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>System & Netværk:</strong> Komplet W. Richard Stevens samling (UNIX, TCP/IP).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>C++ Masterclass:</strong> Stroustrup, Meyers, Sutter & Alexandrescu.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Agile & Design:</strong> Fowler, Beck, Martin & McConnell.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Open Source Kultur:</strong> Raymond (The Cathedral & the Bazaar) & Lessig.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>O'Reilly Specialiteter:</strong> De klassiske "dyrebøger" om Python, Linux & Sikkerhed.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-foreground">Hvorfor eje denne samling?</h3>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground/80 border-l-4 border-primary/20 pl-4">
                Selvom vi lever i en digital tidsalder, er dybden i disse fysiske værker uovertruffen. Her får du uforkortede teorier bag algoritmer, netværksprotokoller og systemarkitektur, præsenteret af de originale pionerer. De fleste bøger er fra anerkendte kvalitetsforlag som <strong>Addison-Wesley, O'Reilly, Manning</strong> og <strong>Prentice Hall</strong>.
              </p>
            </div>
            
            <div className="pt-4">
              <a
                href="https://photos.app.goo.gl/RxiK36Hwr8CJec2dA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 font-semibold group"
              >
                Gå til Google Photos-albummet
                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ExpandableBox title="C++ & Systemarkitektur">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dette er uden tvivl samlingens tungeste og mest værdifulde pakke rent teknisk. Den dækker alt fra de helt lave lag i operativsystemet til de mest avancerede C++ templates.
            </p>
            <ul className="text-sm text-muted-foreground/80 leading-relaxed space-y-2">
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Kernen:</strong> Stroustrup, Meyers, Sutter og Alexandrescu.</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Netværk & System:</strong> Stevens' katalog & Tanenbaum.</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Patterns:</strong> Boost, STL, CORBA & Design Patterns.</span></li>
            </ul>
            <p className="text-sm font-medium pt-2 text-foreground">
              Den ultimative ressource for systemprogrammøren gennem 30 år.
            </p>
          </ExpandableBox>

          <ExpandableBox title="Agile & Leadership">
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              Skræddersyet til den moderne it-organisation, tech-leads eller Scrum Masters.
            </p>
            <ul className="text-sm text-muted-foreground/80 leading-relaxed space-y-2">
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Processer:</strong> Mike Cohn, Kent Beck og Gojko Adzic.</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Kvalitet:</strong> Refactoring, Code Complete & Release It!.</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Startup:</strong> The Lean Startup, Rework & Joel on Software.</span></li>
            </ul>
            <p className="text-sm font-medium pt-2 text-foreground">
              Den komplette opskrift på succesfuld softwareudvikling.
            </p>
          </ExpandableBox>

          <ExpandableBox title="Full-Stack & DevOps">
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              Den perfekte pakke til DevOps-engineeren præget af O'Reilly "dyrebøgerne".
            </p>
            <ul className="text-sm text-muted-foreground/80 leading-relaxed space-y-2">
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Sprog & Web:</strong> Python, Perl, JavaScript & REST.</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Infrastruktur:</strong> Git, Docker, Vagrant & Sikkerhed.</span></li>
              <li className="flex gap-2"><span className="text-primary">•</span><span><strong>Data & Kultur:</strong> MySQL, PostgreSQL & Open Source filosofi.</span></li>
            </ul>
            <p className="text-sm font-medium pt-2 text-foreground">
              Dækker alle de praktiske værktøjer, der driver internettet.
            </p>
          </ExpandableBox>
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 max-w-2xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Søg i bogsamlingen (titel, forfatter, ISBN...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg rounded-xl border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="border rounded-2xl overflow-hidden shadow-2xl bg-background border-muted-foreground/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-muted-foreground/10">
                  <th
                    className="px-6 py-5 font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-muted/60 transition-colors select-none"
                    onClick={() => handleSort("titel")}
                  >
                    <div className="flex items-center gap-2">
                      Titel
                      {getSortIcon("titel")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-5 font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-muted/60 transition-colors select-none"
                    onClick={() => handleSort("forfattere")}
                  >
                    <div className="flex items-center gap-2">
                      Forfatter
                      {getSortIcon("forfattere")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-5 font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-muted/60 transition-colors select-none"
                    onClick={() => handleSort("forlag")}
                  >
                    <div className="flex items-center gap-2">
                      Forlag
                      {getSortIcon("forlag")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-5 font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-muted/60 transition-colors select-none"
                    onClick={() => handleSort("emne")}
                  >
                    <div className="flex items-center gap-2">
                      Emne
                      {getSortIcon("emne")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-5 font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-muted/60 transition-colors select-none"
                    onClick={() => handleSort("isbn13")}
                  >
                    <div className="flex items-center gap-2">
                      ISBN
                      {getSortIcon("isbn13")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-5 font-bold text-sm uppercase tracking-wider cursor-pointer hover:bg-muted/60 transition-colors select-none w-24 text-center"
                    onClick={() => handleSort("år")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      År
                      {getSortIcon("år")}
                    </div>
                  </th>
                  <th className="px-6 py-5 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-foreground/5">
                {filteredAndSortedBooks.map((book, index) => (
                  <tr
                    key={`${book.isbn13}-${index}`}
                    className="hover:bg-primary/[0.02] transition-colors cursor-pointer group/row"
                    onClick={() => handleBookClick(book.isbn13)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:block opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <CopyButton textToCopy={book.titel} />
                        </div>
                        <span className="font-semibold text-foreground group-hover/row:text-primary transition-colors leading-snug">
                          {book.titel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{book.forfattere}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{book.forlag}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{book.emne}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground/70 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{book.isbn13}</span>
                        <div className="opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <CopyButton textToCopy={book.isbn13} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-muted-foreground font-medium">{book.år}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="p-2 rounded-full group-hover/row:bg-primary/10 transition-colors">
                        <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover/row:opacity-100 transition-all scale-75 group-hover/row:scale-100" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredAndSortedBooks.length === 0 && (
        <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-muted-foreground/20">
          <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-xl font-medium text-muted-foreground">Ingen bøger fundet</p>
          <p className="text-muted-foreground/60">Vi kunne ikke finde noget der matcher "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}