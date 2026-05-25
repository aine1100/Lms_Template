"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Search, Grid3x3, List, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre?: string;
  quantity: number;
  availableQuantity: number;
}

type ViewType = 'grid' | 'list';

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [genres, setGenres] = useState<string[]>([]);

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/books/report');
        const booksData = Array.isArray(response.data) ? response.data : response.data.books || [];
        setBooks(booksData);

        // Extract unique genres
        const uniqueGenres = Array.from(
          new Set(booksData.map((b: Book) => b.genre).filter(Boolean))
        ) as string[];
        setGenres(uniqueGenres.sort());

        // Filter by search and genre
        filterBooks(booksData, '', 'all');
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search and genre
  const filterBooks = useCallback((bookList: Book[], search: string, genre: string) => {
    let filtered = bookList;

    // Filter by genre
    if (genre !== 'all') {
      filtered = filtered.filter((b) => b.genre === genre);
    }

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.isbn.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterBooks(books, query, selectedGenre);
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
    filterBooks(books, searchQuery, genre);
  };

  const getAvailabilityStatus = (book: Book) => {
    if (book.availableQuantity === 0) {
      return {
        status: 'out-of-stock',
        label: 'Out of Stock',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      };
    } else if (book.availableQuantity <= 2) {
      return {
        status: 'low-stock',
        label: `Only ${book.availableQuantity} left`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      };
    } else {
      return {
        status: 'available',
        label: `${book.availableQuantity} Available`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading library catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Browse Library</h1>
        <p className="text-slate-500">Discover all available books in our collection</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Genre Filter & View Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="all">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* View Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'grid'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewType === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-500">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </div>

      {/* No Results */}
      {!loading && filteredBooks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center"
        >
          <AlertCircle size={48} className="text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No Books Found</h3>
          <p className="text-slate-500">Try adjusting your search filters</p>
        </motion.div>
      )}

      {/* Books Grid View */}
      {viewType === 'grid' && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book, index) => {
            const availability = getAvailabilityStatus(book);
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                {/* Book Cover Placeholder */}
                <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden relative">
                  <div className="text-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-4xl font-bold text-primary/30 truncate px-2">
                      {book.title.charAt(0)}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Book Cover</p>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 mb-1">{book.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{book.author}</p>

                  {/* Genre Badge */}
                  {book.genre && (
                    <div className="inline-block bg-slate-100 text-slate-600 rounded px-2 py-1 text-[10px] font-semibold mb-3">
                      {book.genre}
                    </div>
                  )}

                  {/* ISBN */}
                  <p className="text-[10px] text-slate-400 mb-3">ISBN: {book.isbn}</p>

                  {/* Availability Status */}
                  <div className={`${availability.bgColor} ${availability.color} rounded-lg p-2 text-center font-semibold text-xs`}>
                    {availability.label}
                  </div>

                  {/* Quantity Info */}
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Total: {book.quantity}</span>
                    <span>Available: {book.availableQuantity}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Books List View */}
      {viewType === 'list' && filteredBooks.length > 0 && (
        <div className="space-y-2">
          {filteredBooks.map((book, index) => {
            const availability = getAvailabilityStatus(book);
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{book.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{book.author}</span>
                    {book.genre && <span>•</span>}
                    {book.genre && <span>{book.genre}</span>}
                    <span>•</span>
                    <span>ISBN: {book.isbn}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  {/* Stock Badge */}
                  <div className={`${availability.bgColor} ${availability.color} rounded px-3 py-1 font-semibold text-xs`}>
                    {availability.label}
                  </div>

                  {/* Quantity */}
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-800">
                      {book.availableQuantity}/{book.quantity}
                    </div>
                    <div className="text-[10px] text-slate-500">Available</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
