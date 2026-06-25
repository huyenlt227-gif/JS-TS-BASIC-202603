
// Bài 1: Class `Library` — Quản lý thư viện Neko Books

interface IBook {
  title: string;
  author: string;
  year: number;
  genre: string;
  available: boolean;
}

type BookFilter = {
  title?: string;
  genre?: string;
  yearFrom?: number;
};

class Library {
  private books: IBook[] = [];

  addBook(book: IBook): void {
    for (const existing of this.books) {
      if (existing.title === book.title && existing.author === book.author) {
        throw new Error(
          `Sách "${book.title}" của "${book.author}" đã tồn tại trong thư viện.`
        );
      }
    }
    this.books.push(book);
  }

  getAllBooks(): IBook[] {
    return [...this.books];
  }

  findByTitle(keyword: string): IBook[] {
    return this.books.filter((book) =>
      book.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  filter(filter: BookFilter): IBook[] {
    return this.books.filter((book) => {
      if (
        filter.title !== undefined &&
        !book.title.toLowerCase().includes(filter.title.toLowerCase())
      ) {
        return false;
      }
      if (filter.genre !== undefined && book.genre !== filter.genre) {
        return false;
      }
      if (filter.yearFrom !== undefined && book.year < filter.yearFrom) {
        return false;
      }
      return true;
    });
  }

  getAvailableBooks(): IBook[] {
    return this.books.filter((book) => book.available === true);
  }

  getStats(): {
    total: number;
    available: number;
    borrowed: number;
    genres: string[];
  } {
    const total = this.books.length;
    const available = this.books.filter((b) => b.available).length;
    const borrowed = total - available;
    const genres: string[] = [];
    for (const book of this.books) {
      if (!genres.includes(book.genre)) {
        genres.push(book.genre);
      }
    }
    return { total, available, borrowed, genres };
  }

  borrowBook(title: string): boolean {
    const book = this.books.find((b) => b.title === title);
    if (!book) {
      throw new Error(`Không tìm thấy sách "${title}".`);
    }
    if (!book.available) {
      throw new Error(`Sách "${title}" đã được mượn rồi.`);
    }
    book.available = false;
    return true;
  }

  returnBook(title: string): boolean {
    const book = this.books.find((b) => b.title === title);
    if (!book) {
      throw new Error(`Không tìm thấy sách "${title}".`);
    }
    if (book.available) {
      throw new Error(`Sách "${title}" chưa được mượn, không thể trả.`);
    }
    book.available = true;
    return true;
  }
}

// ---- Test ----
const lib = new Library();

lib.addBook({ title: "Clean Code", author: "Robert Martin", year: 2008, genre: "Programming", available: true });
lib.addBook({ title: "Design Patterns", author: "GoF", year: 1994, genre: "Programming", available: true });
lib.addBook({ title: "Dế Mèn Phiêu Lưu Ký", author: "Tô Hoài", year: 1941, genre: "Văn học", available: false });
lib.addBook({ title: "Refactoring", author: "Martin Fowler", year: 1999, genre: "Programming", available: true });

console.log(lib.getAllBooks().length); // 4
console.log(lib.findByTitle("clean")); //[{ Clean Code }]  
console.log(lib.filter({ genre: "Programming", yearFrom: 2000 }).length); // 1
console.log(lib.getAvailableBooks().length); // 3
console.log(lib.getStats()); // { total: 4, available: 3, borrowed: 1, genres: ["Programming", "Văn học"] }

