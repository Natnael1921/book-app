import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const tempBook = [
  {
    poster: "https://m.media-amazon.com/images/I/71TZ8BmoZqL._AC_SL1000_.jpg",
    title: "Lord of The Rings",
    year: 1980,
    key: 2345,
    genre: "Fantasy",
    author: "J.R.R. Tolkien",
  },
  {
    poster:
      "https://www.originalfilmart.com/cdn/shop/files/harry_potter_and_the_sorcerers_stone_2001_original_film_art_5000x.webp?v=1684872812",
    title: "Harry Potter",
    year: 1997,
    key: 564865,
    genre: "Fantasy",
    author: "J.K. Rowling",
  },
  {
    poster:
      "https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    title: "Game of Thrones",
    year: 1996,
    key: 74637,
    genre: "Fantasy / Drama",
    author: "George R.R. Martin",
  },
  {
    poster: "https://m.media-amazon.com/images/I/71g40mlbinL.jpg",
    title: "The Hobbit",
    year: 1937,
    key: 837472,
    genre: "Fantasy",
    author: "J.R.R. Tolkien",
  },
  {
    poster: "https://m.media-amazon.com/images/I/81iqZ2HHD-L.jpg",
    title: "To Kill a Mockingbird",
    year: 1960,
    key: 100294,
    genre: "Classic / Drama",
    author: "Harper Lee",
  },
  {
    poster: "https://m.media-amazon.com/images/I/91uwocAMtSL.jpg",
    title: "The Great Gatsby",
    year: 1925,
    key: 903245,
    genre: "Classic / Tragedy",
    author: "F. Scott Fitzgerald",
  },
  {
    poster: "https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg",
    title: "1984",
    year: 1949,
    key: 624831,
    genre: "Dystopian / Political Fiction",
    author: "George Orwell",
  },
  {
    poster: "https://m.media-amazon.com/images/I/91b0C2YNSrL.jpg",
    title: "Pride and Prejudice",
    year: 1813,
    key: 127483,
    genre: "Romance / Classic",
    author: "Jane Austen",
  },
  {
    poster: "https://m.media-amazon.com/images/I/91SZSW8qSsL.jpg",
    title: "The Catcher in the Rye",
    year: 1951,
    key: 783241,
    genre: "Classic / Coming-of-Age",
    author: "J.D. Salinger",
  },
  {
    poster: "https://m.media-amazon.com/images/I/81WcnNQ-TBL.jpg",
    title: "The Alchemist",
    year: 1988,
    key: 482957,
    genre: "Adventure / Philosophy",
    author: "Paulo Coelho",
  },
  {
    poster: "https://m.media-amazon.com/images/I/81xTx-LTtBL.jpg",
    title: "Sapiens: A Brief History of Humankind",
    year: 2011,
    key: 984563,
    genre: "Non-fiction / History",
    author: "Yuval Noah Harari",
  },
];

export default function App() {
  const [books, setBooks] = useState(tempBook);
  const [query, setQuery] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [WishList, setWishList] = useLocalStorage([], "WishList");
  const [finished, setFinished] = useLocalStorage([], "finished");
  const [error, setError] = useState(null);
  function handleWishList(book) {
    const alreadyExist = WishList.some((b) => b.key === book.key);
    if (alreadyExist) {
      alert("This Book already exist in your shelf ");
      return;
    }
    const newBook = {
      ...book,
      completed: false,
      id: Date.now(),
    };
    setWishList([...WishList, newBook]);
  }

  function handleFinished(book, id) {
    setWishList((books) => books.filter((book) => book.id !== id));
    setFinished([...finished, book]);
  }
  function handleDelete(id) {
    setWishList((books) => books.filter((book) => book.id !== id));
    setFinished((books) => books.filter((book) => book.id !== id));
  }

  function handleLogoClick() {
    setQuery("");
    setBooks(tempBook);
    setError(null);
  }

  useEffect(
    function () {
      if (!query) return;

      async function fetchBooks() {
        try {
          setIsLoading(true);
          setError(null);

          const res = await fetch(
            `https://openlibrary.org/search.json?q=${query}`
          );
          if (!res.ok) throw new Error("Failed to fetch books");

          const data = await res.json();
          const books = data.docs.map((book) => ({
            title: book.title,
            year: book.first_publish_year,
            poster: book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : "",
            author: book.author_name,
            key: book.key,
          }));
          setBooks(books);
        } catch (err) {
          console.error("Error fetching books:", err.message);
          setError(
            "Failed to load books. Please check your internet connection."
          );
          setBooks([]);
        } finally {
          setIsLoading(false);
        }
      }

      fetchBooks();
    },
    [query]
  );

  return (
    <div>
      <NavBar
        query={query}
        setQuery={setQuery}
        onLogoClick={handleLogoClick}
        books={books}
      />

      <div className="box-container">
        <ReadingWishList
          WishList={WishList}
          handleFinished={handleFinished}
          handleDelete={handleDelete}
        />
        <div>
          {error && <p className="error-message">{error}</p>}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <SearchBox
              handleWishList={handleWishList}
              books={books}
              WishList={WishList}
            />
          )}
        </div>
        <StatusBar
          WishList={WishList}
          finished={finished}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}

function NavBar({ query, setQuery, onLogoClick, books }) {
  return (
    <div className="nav-bar" onClick={onLogoClick}>
      <div className="logo-container">
        <img className="logo-icon" src="\public\image.png" />
        <span className="logo">BookLog</span>
      </div>
      <div>
        <input
          type="text"
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search for books..."
        />
      </div>
      <div>
        <span className="results">Found {books.length} Books</span>
      </div>
    </div>
  );
}
function Loader() {
  return (
    <div className="loader">
      Books Loading...
      <span className="spinner">🔃</span>
    </div>
  );
}

function SearchBox({ books, handleWishList, WishList }) {
  const [selectedBook, setSelectedBook] = useState(null);
  return (
    <div className="search-box">
      <div>
        <Addvertisement WishList={WishList} />
      </div>
      <div className="main-container">
        {!selectedBook ? (
          books.map((book) => (
            <div
              className="book-container"
              onClick={() => setSelectedBook(book)}
            >
              <div className="searchbox-container">
                <div className="book-poster">
                  <img
                    className="book-poster"
                    src={book.poster}
                    alt={`${book.title}'s poster`}
                  />
                </div>

                <div className="title-year">
                  <span className="book-title">{book.title}</span>
                  <span className="book-year">{book.year}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <BookDetails
            handleWishList={handleWishList}
            book={selectedBook}
            onBack={() => setSelectedBook(null)}
          />
        )}
      </div>
    </div>
  );
}

function BookDetails({ book, onBack, handleWishList }) {
  const [details, setDetails] = useState(null);
  useEffect(
    function () {
      async function fetchDetails() {
        const res = await fetch(`https://openlibrary.org${book.key}.json`);
        const data = await res.json();
        setDetails(data);
      }
      fetchDetails();
    },
    [book]
  );
  return (
    <div className="details">
      <button className="back-btn" onClick={onBack}>
        &larr;
      </button>
      <span className="detail-title">{book.title}</span>

      <div className="img-description">
        <div className="img">
          <img
            className="detail-poster"
            src={book.poster}
            alt={`${book.title}'s poster`}
          />
        </div>
        <div className="description">
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>published:</strong> {book.year}
          </p>
          <p>
            <strong>Genre:</strong>{" "}
            {details?.subjects
              ? details.subjects.slice(0, 3).join(", ")
              : "N/A"}
          </p>
        </div>
      </div>
      <button className="btn" onClick={() => handleWishList(book)}>
        Add to Shelf
      </button>
    </div>
  );
}

function ReadingWishList({ WishList, handleFinished, handleDelete }) {
  return (
    <div className="wishlist">
      <h2 className="wishlist-header">Your Shelf</h2>

      {WishList.map((book) => (
        <div className={book.completed ? "completed" : "img-title"}>
          <div>
            <img
              className={
                !book.completed ? "wishlist-poster" : "completed-poster"
              }
              src={book.poster}
              alt={`${book.title}'s poster`}
            />
          </div>
          <div className="title-checkbox">
            <p className="wishlist-title">{book.title}</p>
            <div className="read-btn-section">
              <button
                onClick={() => handleFinished(book, book.id)}
                className="read-btn"
              >
                Finished
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(book.id)}
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function StatusBar({ finished, WishList, handleDelete }) {
  return (
    <div className="status-bar">
      <div className="currently-reading-box">
        <h3 className="headers">Currently Reading Book</h3>
        {WishList.length > 0 && (
          <div className="current-img-title">
            <img className="current-book-poster " src={WishList[0].poster} />
            <p className="current-book-title">{WishList[0].title}</p>
          </div>
        )}
      </div>
      <div className="finished-books">
        <h3 className="headers">Recently finished</h3>
        <div>
          {finished.map((book) => (
            <div className="status-img-title">
              <img className="status-book-poster" src={book.poster} />
              <p>{book.title}</p>
              <button
                className="delete-button"
                onClick={() => handleDelete(book.id)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Addvertisement({ WishList }) {
  const slides = [
    "“Books are the plane, and the train, and the road. They are the destination and the journey.” – Anna Quindlen",
    "“A reader lives a thousand lives before he dies. The man who never reads lives only one.” – George R.R. Martin",
    "“So many books, so little time.” – Frank Zappa",
    "“That’s the thing about books. They let you travel without moving your feet.” – Jhumpa Lahiri",
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="advertisement-box">
      <h1>Welcome Back!</h1>
      <h3>Your shelf has {WishList.length} unread books — time to dive in!</h3>
      <h5 className="slide-text">{slides[index]}</h5>
    </div>
  );
}
