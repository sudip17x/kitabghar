import React, { useState, useEffect } from 'react';
import { ShoppingCart, Book, Upload, Users, LogOut, Moon, Sun, Search, Star, Eye, Trash2, Plus, DollarSign, Package, X, AlertCircle, Download } from 'lucide-react';

const ADMIN_CREDENTIALS = {
  email: 'sudip17x@gmail.com',
  password: '123456',
  role: 'admin',
  name: 'Admin User'
};

// =========================================
// New Category Data from your SQL schema
// =========================================
const bookCategories = [
  { name: 'School Textbooks', subcategories: ['Nursery', 'Primary', 'Secondary', 'Higher Secondary'] },
  { name: 'Competitive Exam Guides', subcategories: ['WBCS', 'WBPSC', 'SSC', 'JEE', 'NEET', 'Banking', 'Railways', 'NET/SET', 'Police Exams', 'Other State Exams'] },
  { name: 'Reference Books', subcategories: ['Mathematics', 'Science', 'History', 'Geography', 'Political Science', 'Economics', 'Literature', 'Computer Science'] },
  { name: 'Language Learning', subcategories: ['Bengali', 'English', 'Hindi', 'Sanskrit', 'Foreign Languages (French, German, Spanish)'] },
  { name: 'Literature', subcategories: ['Bengali Poetry', 'Novels', 'Short Stories', 'Essays', 'Modern Literature', 'Classical Literature'] },
  { name: 'Religious Books', subcategories: ['Hinduism', 'Islam', 'Christianity', 'Buddhism', 'Jainism', 'Sikhism'] },
  { name: 'Biographies and Autobiographies', subcategories: ['Political Leaders', 'Freedom Fighters', 'Scientists', 'Artists & Writers', 'Sports Personalities'] },
  { name: 'Regional Culture & Heritage', subcategories: ['Bengal History', 'Folklore', 'Art & Craft', 'Travel', 'Cuisine'] },
  { name: 'Children’s Books', subcategories: ['Storybooks', 'Comics', 'Activity Books', 'Early Learning', 'Moral Stories'] },
  { name: 'Comics and Graphic Novels', subcategories: ['Indian Comics', 'Bengali Comics', 'Superhero Comics', 'Manga & Anime', 'Classic Graphic Novels'] },
  { name: 'Classic Novels', subcategories: ['Indian Classics', 'Bengali Classics', 'World Classics', 'Translated Works'] },
  { name: 'Self-help and Personal Development', subcategories: ['Motivation', 'Productivity', 'Leadership', 'Mindfulness', 'Psychology'] },
  { name: 'Science and Technology', subcategories: ['Physics', 'Chemistry', 'Biology', 'Computer Science', 'Engineering', 'Space & Innovation'] },
  { name: 'Health & Wellness', subcategories: ['Yoga', 'Ayurveda', 'Diet & Nutrition', 'Mental Health', 'Medicine'] },
  { name: 'Cookbooks and Food', subcategories: ['Indian Cuisine', 'Bengali Cuisine', 'Bakery & Desserts', 'Healthy Cooking', 'International Cuisine'] },
  { name: 'Magazines & Periodicals', subcategories: ['Educational Magazines', 'Current Affairs', 'Lifestyle & Fashion', 'Science & Tech Magazines', 'Monthly Journals'] },
  { name: 'General Knowledge & Quiz Books', subcategories: ['Current Affairs', 'Trivia', 'Olympiad Prep', 'Quiz Compilations', 'GK for Kids'] },
  { name: 'Dictionaries and Encyclopedias', subcategories: ['English Dictionary', 'Bilingual Dictionary', 'Subject Encyclopedias', 'Children’s Encyclopedias'] },
  { name: 'Drama and Plays', subcategories: ['Bengali Plays', 'English Drama', 'Modern Theatre', 'Classical Drama'] },
  { name: 'Satire and Humour', subcategories: ['Satirical Essays', 'Humorous Stories', 'Comic Sketches', 'Political Satire'] },
  { name: 'Spirituality & Philosophy', subcategories: ['Indian Philosophy', 'Western Philosophy', 'Spiritual Teachings', 'Meditation Guides', 'Mind & Soul'] },
  { name: 'Miscellaneous', subcategories: ['Travel Guides', 'Hobby Books', 'Handbooks', 'Journals', 'Misc. Collections'] }
];

// Notification Component
const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const { type, message } = notification;
  const isError = type === 'error';

  return (
    <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg flex items-center ${
      isError ? 'bg-red-500' : 'bg-green-500'
    } text-white`}>
      <AlertCircle className="w-5 h-5 mr-3" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'reader' });
  
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for new category system
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  
  // State for upload form dropdowns
  const [uploadCategory, setUploadCategory] = useState(bookCategories[0].name);
  const [uploadSubcategories, setUploadSubcategories] = useState(bookCategories[0].subcategories);
  
  const [currentBook, setCurrentBook] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'success' or 'error', message: '...' }
  const [uploadingFile, setUploadingFile] = useState(null); // For author file upload

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  useEffect(() => {
    // Update sample books to use new category structure
    const sampleBooks = [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classic Novels', subcategory: 'World Classics', price: 12.99, cover: '📚', rating: 4.5, reviews: 245, description: 'A classic American novel about the glamour and excess of the Roaring Twenties. Explores themes of wealth, love, and the American Dream.', fileName: 'The_Great_Gatsby.pdf' },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic Novels', subcategory: 'World Classics', price: 10.99, cover: '📖', rating: 4.8, reviews: 532, description: 'A gripping tale of justice, prejudice, and innocence in the American South. Told through the eyes of a young girl, Scout Finch.', fileName: 'To_Kill_a_Mockingbird.epub' },
      { id: 3, title: 'JavaScript Mastery', author: 'John Doe', category: 'Science and Technology', subcategory: 'Computer Science', price: 29.99, cover: '💻', rating: 4.3, reviews: 89, description: 'Master modern JavaScript, from fundamentals to advanced topics like React, Node.js, and more. Includes hands-on projects.', fileName: 'JavaScript_Mastery.pdf' },
    ];
    setBooks(sampleBooks);

    const storedUser = localStorage.getItem('kitabghar_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  // Effect to update available subcategories when main category filter changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setAvailableSubcategories([]);
    } else {
      const categoryData = bookCategories.find(c => c.name === selectedCategory);
      setAvailableSubcategories(categoryData ? categoryData.subcategories : []);
    }
    setSelectedSubcategory('all'); // Reset subcategory when main category changes
  }, [selectedCategory]);
  
  // Effect to update upload form subcategories
  useEffect(() => {
      const categoryData = bookCategories.find(c => c.name === uploadCategory);
      setUploadSubcategories(categoryData ? categoryData.subcategories : []);
  }, [uploadCategory]);


  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (selectedRole === 'admin') {
      if (loginForm.email === ADMIN_CREDENTIALS.email && loginForm.password === ADMIN_CREDENTIALS.password) {
        const user = ADMIN_CREDENTIALS;
        setCurrentUser(user);
        localStorage.setItem('kitabghar_user', JSON.stringify(user));
        setCurrentPage('dashboard');
        setLoginForm({ email: '', password: '' });
        showNotification('success', 'Admin login successful!');
        return;
      } else {
        showNotification('error', 'Invalid admin credentials!');
        return;
      }
    }

    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password && u.role === selectedRole);
    if (user) {
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('kitabghar_user', JSON.stringify(userWithoutPassword));
      setCurrentPage('dashboard');
      setLoginForm({ email: '', password: '' });
      showNotification('success', `${selectedRole} login successful!`);
    } else {
      showNotification('error', `Invalid ${selectedRole} credentials!`);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (selectedRole === 'admin') {
      showNotification('error', 'Admin accounts cannot be registered.');
      return;
    }

    if (selectedRole === 'author') {
      showNotification('error', 'Author accounts can only be created by Admin.');
      return;
    }

    if (users.find(u => u.email === registerForm.email)) {
      showNotification('error', 'Email already exists!');
      return;
    }
    const newUser = { ...registerForm, id: Date.now(), role: selectedRole };
    setUsers([...users, newUser]);
    showNotification('success', 'Registration successful! Please login.');
    setCurrentPage('login');
    setRegisterForm({ name: '', email: '', password: '', role: 'reader' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kitabghar_user');
    setCurrentPage('role-selection');
    setSelectedRole(null);
    setCart([]);
    showNotification('success', 'Logged out successfully.');
  };

  const addAuthor = (authorData) => {
    const newAuthor = { ...authorData, id: Date.now(), role: 'author' };
    setUsers([...users, newAuthor]);
    setAuthors([...authors, newAuthor]);
    showNotification('success', 'Author added successfully!');
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    setAuthors(authors.filter(a => a.id !== userId));
    showNotification('success', 'User deleted.');
  };

  // Updated addBook to accept subcategory
  const addBook = (bookData) => {
    const newBook = {
      ...bookData, // This now includes title, category, subcategory, price, description, fileName
      id: Date.now(),
      author: currentUser.name,
      rating: 0,
      reviews: 0,
      cover: '📘',
    };
    setBooks([...books, newBook]);
    showNotification('success', 'Book uploaded successfully!');
  };

  const updateBookPrice = (bookId, newPrice) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, price: parseFloat(newPrice) } : book
    ));
    showNotification('success', 'Price updated.');
  };

  const deleteBook = (bookId) => {
    setBooks(books.filter(book => book.id !== bookId));
    showNotification('success', 'Book deleted.');
  };

  const addToCart = (book) => {
    if (!cart.find(item => item.id === book.id) && !purchasedBooks.find(item => item.id === book.id)) {
      setCart([...cart, book]);
      showNotification('success', `${book.title} added to cart.`);
    } else {
      showNotification('error', 'Book is already in cart or owned.');
    }
  };

  const removeFromCart = (bookId) => {
    setCart(cart.filter(item => item.id !== bookId));
    showNotification('success', 'Removed from cart.');
  };

  const purchaseBooks = () => {
    setPurchasedBooks([...purchasedBooks, ...cart]);
    setCart([]);
    showNotification('success', 'Purchase successful! Books added to your library.');
  };

  const purchaseSingleBook = (book) => {
    // Add to purchased list
    setPurchasedBooks([...purchasedBooks, book]);
    // Remove from cart
    setCart(cart.filter(item => item.id !== book.id));
    // Show notification
    showNotification('success', `${book.title} purchased successfully!`);
  };

  const handleDownload = (book) => {
    const content = `This is a dummy file for ${book.title} by ${book.author}.\n\nIn a real app, this would be the actual book file (${book.fileName}).\n\nBook Description:\n${book.description}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Use the stored fileName, or generate a .txt file name
    a.download = book.fileName ? book.fileName.replace(/\.(pdf|epub)$/i, '.txt') : `${book.title.replace(/ /g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('success', `Downloading ${book.title}...`);
  };

  // Updated filtering logic
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || book.subcategory === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Main categories for dropdown
  const mainCategories = ['all', ...bookCategories.map(c => c.name)];

  // This is the main render function
  const renderPage = () => {
    if (currentPage === 'role-selection') {
      return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-5xl">
              <div className="text-center mb-12">
                <div className="text-7xl mb-6">📚</div>
                <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-3">KitabGhar</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Choose Your Role to Continue</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Admin Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:-translate-y-2">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👨‍💼</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Admin</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                      Manage users, authors, and oversee all books in the system
                    </p>
                    <ul className="text-left text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                      <li>✓ Add/Remove Authors</li>
                      <li>✓ Manage All Users</li>
                      <li>✓ Delete Any Book</li>
                      <li>✓ View Analytics</li>
                    </ul>
                    <button
                      onClick={() => {
                        setSelectedRole('admin');
                        setCurrentPage('login');
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Login as Admin
                    </button>
                  </div>
                </div>

                {/* Author Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:-translate-y-2">
                  <div className="text-center">
                    <div className="text-6xl mb-4">✍️</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Author</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                      Upload and manage your books, set prices, and track sales
                    </p>
                    <ul className="text-left text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                      <li>✓ Upload Books</li>
                      <li>✓ Edit Book Prices</li>
                      <li>✓ Manage Your Books</li>
                      <li>✓ View Statistics</li>
                    </ul>
                    <button
                      onClick={() => {
                        setSelectedRole('author');
                        setCurrentPage('login');
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Login as Author
                    </button>
                  </div>
                </div>

                {/* Reader Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:-translate-y-2">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📖</div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Reader</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                      Browse, purchase, and read your favorite books
                    </p>
                    <ul className="text-left text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
                      <li>✓ Browse Library</li>
                      <li>✓ Purchase Books</li>
                      <li>✓ Read Online</li>
                      <li>✓ Write Reviews</li>
                    </ul>
                    <button
                      onClick={() => {
                        setSelectedRole('reader');
                        setCurrentPage('login');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Login as Reader
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                  <span className="text-gray-700 dark:text-gray-300">Toggle Theme</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'login') {
      return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
              <button
                onClick={() => {
                  setCurrentPage('role-selection');
                  setSelectedRole(null);
                  setLoginForm({ email: '', password: '' });
                }}
                className="mb-6 text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to Role Selection
              </button>

              <div className="text-center mb-8">
                <div className="text-6xl mb-4">
                  {selectedRole === 'admin' && '👨‍💼'}
                  {selectedRole === 'author' && '✍️'}
                  {selectedRole === 'reader' && '📖'}
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {selectedRole === 'admin' && 'Admin Login'}
                  {selectedRole === 'author' && 'Author Login'}
                  {selectedRole === 'reader' && 'Reader Login'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Sign in to access your {selectedRole} dashboard
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Sign In as {selectedRole}
                </button>
              </form>

              {selectedRole === 'reader' && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Don't have an account? Register here
                  </button>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg text-sm text-purple-800 dark:text-purple-200">
                  <p className="font-semibold text-center">Login using your administrator credentials.</p>
                </div>
              )}

              {selectedRole === 'author' && (
                <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold mb-2">Note:</p>
                  <p>Author accounts are created by Admin only. Contact administrator to get author access.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (currentPage === 'register') {
      return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📖</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Reader Account</h2>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Register
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Main application view
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Book className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">KitabGhar</h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium">
                  {currentUser.role.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentUser.name}
                </span>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>

                {currentUser.role === 'reader' && (
                  <button
                    onClick={() => setCurrentPage('cart')}
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex space-x-6">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`py-4 border-b-2 transition-colors ${
                  currentPage === 'dashboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('library')}
                className={`py-4 border-b-2 transition-colors ${
                  currentPage === 'library'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Library
              </button>
              {currentUser.role === 'author' && (
                <button
                  onClick={() => setCurrentPage('upload')}
                  className={`py-4 border-b-2 transition-colors ${
                    currentPage === 'upload'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Upload Book
                </button>
              )}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`py-4 border-b-2 transition-colors ${
                    currentPage === 'admin'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Admin Panel
                </button>
              )}
              {currentUser.role === 'reader' && (
                <button
                  onClick={() => setCurrentPage('my-books')}
                  className={`py-4 border-b-2 transition-colors ${
                    currentPage === 'my-books'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  My Books
                </button>
              )}
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {currentPage === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Welcome, {currentUser.name}!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Total Books</p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{books.length}</p>
                    </div>
                    <Book className="w-12 h-12 text-blue-600" />
                  </div>
                </div>

                {currentUser.role === 'admin' && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{users.length + 1}</p>
                      </div>
                      <Users className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                )}

                {currentUser.role === 'reader' && (
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">In Cart</p>
                          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{cart.length}</p>
                        </div>
                        <ShoppingCart className="w-12 h-12 text-orange-600" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Purchased</p>
                          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{purchasedBooks.length}</p>
                        </div>
                        <Package className="w-12 h-12 text-purple-600" />
                      </div>
                    </div>
                  </>
                )}

                {currentUser.role === 'author' && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">My Books</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                          {books.filter(b => b.author === currentUser.name).length}
                        </p>
                      </div>
                      <Upload className="w-12 h-12 text-green-600" />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser.role === 'admin' && 'Manage users and oversee all books in the system.'}
                  {currentUser.role === 'author' && 'Upload new books and manage your existing collection.'}
                  {currentUser.role === 'reader' && 'Browse our extensive library and purchase books to read.'}
                </p>
              </div>
            </div>
          )}

          {currentPage === 'library' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Book Library</h2>
                
                {/* Updated Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {mainCategories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                    ))}
                  </select>

                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    disabled={selectedCategory === 'all'}
                  >
                    <option value="all">All Subcategories</option>
                    {availableSubcategories.map(subcat => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map(book => (
                  <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col">
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-6xl mb-4 text-center">{book.cover}</div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{book.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>
                      {/* Updated to show new category structure */}
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{book.category}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">{book.subcategory}</p>
                      
                      <div className="flex items-center mb-4">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {book.rating} ({book.reviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-blue-600">₹{book.price.toFixed(2)}</span>
                        
                        {/* "Buy" Option */}
                        {currentUser.role === 'reader' && (
                          <button
                            onClick={() => addToCart(book)}
                            disabled={cart.find(item => item.id === book.id) || purchasedBooks.find(item => item.id === book.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>{purchasedBooks.find(item => item.id === book.id) ? 'Owned' : cart.find(item => item.id === book.id) ? 'In Cart' : 'Buy'}</span>
                          </button>
                        )}
                      </div>

                      {/* Spacer to push buttons to the bottom */}
                      <div className="flex-grow"></div>

                      {/* Button Container */}
                      <div className="mt-auto space-y-2">
                        {/* "Book Details" Option */}
                        <button
                          onClick={() => {
                            setCurrentBook(book);
                            setCurrentPage('book-details');
                          }}
                          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        
                        {/* Author Buttons */}
                        {currentUser.role === 'author' && book.author === currentUser.name && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const newPrice = prompt('Enter new price:', book.price);
                                if (newPrice && !isNaN(newPrice)) {
                                  updateBookPrice(book.id, newPrice);
                                } else if(newPrice) {
                                  showNotification('error', 'Please enter a valid number.');
                                }
                              }}
                              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                              <DollarSign className="w-4 h-4" />
                              <span>Edit Price</span>
                            </button>
                            <button
                              onClick={() => deleteBook(book.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Read Now Button (if purchased) */}
                        {purchasedBooks.find(item => item.id === book.id) && (
                          <button
                            onClick={() => {
                              setCurrentBook(book);
                              setCurrentPage('reader');
                            }}
                            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Read Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentPage === 'upload' && currentUser.role === 'author' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Upload New Book</h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  addBook({
                    title: formData.get('title'),
                    category: formData.get('category'),
                    subcategory: formData.get('subcategory'), // Add subcategory
                    price: parseFloat(formData.get('price')),
                    description: formData.get('description'),
                    fileName: uploadingFile ? uploadingFile.name : 'sample_book.pdf' // Add file name
                  });
                  e.target.reset();
                  setUploadingFile(null); // Clear the file state
                  setUploadCategory(bookCategories[0].name); // Reset dropdown
                }}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Book Title</label>
                      <input
                        type="text"
                        name="title"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Updated Category Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <select
                          name="category"
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {bookCategories.map(cat => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subcategory</label>
                        <select
                          name="subcategory"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {uploadSubcategories.map(subcat => (
                            <option key={subcat} value={subcat}>{subcat}</option>
                          ))}
                        </select>
                      </div>
                    </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                      <textarea
                        name="description"
                        rows="4"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Book File</label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {uploadingFile ? uploadingFile.name : 'Drag and drop your book file here'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">Supported formats: PDF, EPUB</p>
                        <input 
                          type="file" 
                          accept=".pdf,.epub" 
                          className="hidden" 
                          id="file-upload"
                          onChange={(e) => setUploadingFile(e.target.files[0])}
                        />
                        <label 
                          htmlFor="file-upload" 
                          className="cursor-pointer mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Browse Files
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Book</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {currentPage === 'admin' && currentUser.role === 'admin' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Admin Panel</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Author
                  </h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    addAuthor({
                      name: formData.get('name'),
                      email: formData.get('email'),
                      password: formData.get('password')
                    });
                    e.target.reset();
                  }}>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="name"
                        placeholder="Author Name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Add Author
                      </button>
                    </div>
                  </form>
                </div>

                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Author Management
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {users.filter(u => u.role === 'author').map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                            <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              {user.role}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {users.filter(u => u.role === 'author').length === 0 && (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">No authors registered yet</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Reader Management
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {users.filter(u => u.role === 'reader').map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              {user.role}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {users.filter(u => u.role === 'reader').length === 0 && (
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">No readers registered yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Book className="w-5 h-5 mr-2" />
                  All Books
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Title</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Author</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Category</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Subcategory</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Price</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map(book => (
                        <tr key={book.id} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-800 dark:text-white">{book.title}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{book.author}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{book.category}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{book.subcategory}</td>
                          <td className="py-3 px-4 text-gray-800 dark:text-white font-semibold">₹{book.price.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => deleteBook(book.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NEW "Book Details" Page */}
          {currentPage === 'book-details' && currentBook && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => setCurrentPage('library')}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
                  <span>Back to Library</span>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-1/3 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-700">
                    <span className="text-9xl">{currentBook.cover}</span>
                  </div>
                  <div className="p-8 md:w-2/3 flex flex-col">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{currentBook.title}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">by {currentBook.author}</p>
                    
                    {/* Updated to show new category structure */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium">
                        {currentBook.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium">
                        {currentBook.subcategory}
                      </span>
                    </div>


                    <div className="flex items-center my-4">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">
                        {currentBook.rating} ({currentBook.reviews} reviews)
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {currentBook.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-3xl font-bold text-blue-600">₹{currentBook.price.toFixed(2)}</span>
                      
                      {currentUser.role === 'reader' && (
                        <button
                          onClick={() => addToCart(currentBook)}
                          disabled={cart.find(item => item.id === currentBook.id) || purchasedBooks.find(item => item.id === currentBook.id)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2 text-lg font-semibold"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>{purchasedBooks.find(item => item.id === currentBook.id) ? 'Owned' : cart.find(item => item.id === currentBook.id) ? 'In Cart' : 'Add to Cart'}</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'cart' && currentUser.role === 'reader' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Shopping Cart</h2>
              
              {cart.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 dark:text-gray-400">Your cart is empty</p>
                  <button
                    onClick={() => setCurrentPage('library')}
                    className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Browse Library
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(book => (
                    <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{book.cover}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{book.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">by {book.author}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{book.category} / {book.subcategory}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-blue-600">₹{book.price.toFixed(2)}</span>
                        
                        {/* "Buy Now" Button */}
                        <button
                          onClick={() => purchaseSingleBook(book)}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          title="Buy this book now"
                        >
                          <DollarSign className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => removeFromCart(book.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xl font-bold text-gray-800 dark:text-white">Total:</span>
                      <span className="text-3xl font-bold text-blue-600">
                        ₹{cart.reduce((sum, book) => sum + book.price, 0).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={purchaseBooks}
                      className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Complete Purchase
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentPage === 'my-books' && currentUser.role === 'reader' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">My Purchased Books</h2>
              
              {purchasedBooks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                  <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 dark:text-gray-400">You haven't purchased any books yet</p>
                  <button
                    onClick={() => setCurrentPage('library')}
                    className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Browse Library
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedBooks.map(book => (
                    <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                      <div className="p-6">
                        <div className="text-6xl mb-4 text-center">{book.cover}</div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{book.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">by {book.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">{book.category} / {book.subcategory}</p>
                        
                        <div className="mt-4 space-y-2">
                          <button
                            onClick={() => {
                              setCurrentBook(book);
                              setCurrentPage('reader');
                            }}
                            className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <Eye className="w-5 h-5" />
                            <span>Read Now</span>
                          </button>
                          <button
                            onClick={() => handleDownload(book)}
                            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <Download className="w-5 h-5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentPage === 'reader' && currentBook && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage('my-books')}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
                  <span>Back to My Books</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{currentBook.title}</h2>
                <div className="w-40"></div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="prose dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{currentBook.title}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">by {currentBook.author}</p>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">{currentBook.category} / {currentBook.subcategory}</p>
                    
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                      <p className="text-lg">{currentBook.description}</p>
                      
                      <p>This is a sample book reader interface. In a production environment, this would display the actual book content with features like:</p>
                      
                      <ul className="list-disc list-inside space-y-2">
                        <li>Page navigation</li>
                        <li>Bookmarks and highlights</li>
                        <li>Font size adjustment</li>
                        <li>Reading progress tracking</li>
                        <li>Note-taking capabilities</li>
                        <li>Text-to-speech integration</li>
                      </ul>

                      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Sample Chapter</h3>
                        <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p className="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };
  
  // This is the main return for the App component
  return (
    <>
      <Notification notification={notification} onClose={() => setNotification(null)} />
      {renderPage()}
    </>
  );
};

export default App;