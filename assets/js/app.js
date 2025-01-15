const bookForm = document.getElementById('bookForm');

const tableWrapper = document.getElementsByClassName('table-wrapper');
tableWrapper[0].style.display = 'none';

let allFormFields = (usedFor = 'default') => {
  return `
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="${usedFor != 'default' ? 'editB' : 'b'}ookTitle" placeholder="Enter Book Title">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookTitle">
        Book Title
      </label>
       <span class="mdl-textfield__error" id="titleError"></span>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="${usedFor != 'default' ? 'editB' : 'b'}ookAuthor" placeholder="Enter Book Author">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookAuthor">
        Author
      </label>
      <span class="mdl-textfield__error" id="authorError"></span>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="${usedFor != 'default' ? 'editB' : 'b'}ookGenre" placeholder="Enter Book Genre">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookGenre">
        Genre
      </label>
      <span class="mdl-textfield__error" id="genreError"></span>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="number" id="${usedFor != 'default' ? 'editB' : 'b'}ookPublishYear" placeholder="Enter Publish Year">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookPublishYear">
        Year
      </label>
      <span class="mdl-textfield__error" id="yearError"></span>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="number" id="${usedFor != 'default' ? 'editB' : 'b'}ookQuantity" placeholder="Enter Book Quantity">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookQuantity">
        Quantity
      </label>
      <span class="mdl-textfield__error" id="quantityError"></span>
    </div>
    <div class="mdl-grid ctas-wrapper" style="${usedFor != 'default' ? 'padding-left: 0;' : ''}">
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored"
        style="${usedFor == 'default' ? 'align-self: flex-start; margin-right: 20px;' : ''}" id="${usedFor == 'default' ? 'addBookBtn' : 'saveEditBookBtn'}" type="submit">
        Add Book
      </button>
      <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent ${usedFor != 'default' ? 'close-edit-dialog' : ''}"
        style="${usedFor == 'default' ? 'align-self: flex-start;' : 'margin-left: 20px'}" id="${usedFor == 'default' ? 'clearAllBtn' : 'editClearAllBtn'}" type="button">
        ${usedFor == 'default' ? 'Clear All' : 'Close Dialog'}
      </button>
    </div>
  `
};

bookForm.insertAdjacentHTML('beforeend', allFormFields('default'));

let books = [];

const bookTitle = document.getElementById('bookTitle');
const titleError = document.getElementById("titleError");

const bookAuthor = document.getElementById('bookAuthor');
const authorError = document.getElementById("authorError");

const bookGenre = document.getElementById('bookGenre');
const genreError = document.getElementById("genreError");

const bookPublishYear = document.getElementById('bookPublishYear');
const yearError = document.getElementById("yearError");

const bookQuantity = document.getElementById('bookQuantity');
const quantityError = document.getElementById("quantityError");

const editBookForm = document.getElementById('editBookForm');

const dialog = document.querySelector('dialog');

const clearAllBtn = document.getElementById('clearAllBtn');

// function notifyBooksUpdated() {
//   const event = new Event('booksUpdated');
//   document.dispatchEvent(event);
// }

function loadBooks() {
  const request = indexedDB.open('BookDatabase', 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('books', 'readonly');
    const store = transaction.objectStore('books');

    const getAllRequest = store.getAll();
    getAllRequest.onsuccess = function () {
      books = getAllRequest.result;
      books.forEach(book => addBook(book));
      // notifyBooksUpdated();
    };

    getAllRequest.onerror = function () {
      console.error('Error loading books from IndexedDB:', getAllRequest.error);
    };
  };
}

window.addEventListener('DOMContentLoaded', loadBooks);

function saveToIndexedDB(book) {
  const request = indexedDB.open('BookDatabase', 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('books', 'readwrite');
    const store = transaction.objectStore('books');
    store.add(book);

    transaction.oncomplete = function () {
      console.log('Book saved to IndexedDB:', book);
    };

    transaction.onerror = function () {
      console.error('Error saving book to IndexedDB:', transaction.error);
    };
  };
}

function generateId() {
  return Math.floor(Math.random() * 100000);
}

function addBook(book) {
  tableWrapper[0].style.display = 'block';

  let table = document.querySelector('#addedBooksTable tbody');
  table.insertAdjacentHTML('beforeend', `
    <tr id="${book.id}">
      <td class="mdl-data-table__cell--non-numeric">${book.title}</td>
      <td class="mdl-data-table__cell--non-numeric">${book.author}</td>
      <td class="mdl-data-table__cell--non-numeric">${book.genre}</td>
      <td>${book.year}</td>
      <td>${book.quantity}</td>
      <td class="mdl-data-table__cell--non-numeric">
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored editBookBtn show-modal" data-id='${book.id}'>
          <i class="material-icons">edit</i>
        </button>

        <button class="mdl-button mdl-js-button mdl-button--fab deleteFromTableBtn" data-id='${book.id}'>
          <i class="material-icons">delete</i>
        </button>
      </td>
    </tr>
  `);
}

function validateField(inputField, validationFn, errorMessage) {
  const errorElement = inputField.nextElementSibling.nextElementSibling;

  if (validationFn(inputField.value)) {
    errorElement.textContent = '';
    return true;

  } else {
    errorElement.textContent = errorMessage;
    return false;
  }
}

function addDynamicValidation(inputField, validationFn, errorMessage) {
  inputField.addEventListener('input', () => {
    validateField(inputField, validationFn, errorMessage);
  });
}

const validateBookTitle = (value) => value.length >= 3 && value.length <= 100;

const validateBookAuthor = (value) => value.length >= 3 && value.length <= 100;

const validateBookGenre = (value) => value.length >= 3 && value.length <= 100;

const validateBookPublishYear = (value) =>
  value.length === 4 &&
  !isNaN(value) &&
  parseInt(value) >= 1000 &&
  parseInt(value) <= new Date().getFullYear();

const validateBookQuantity = (value) =>
  !isNaN(value) && parseInt(value) > 0 && parseInt(value) <= 99;

function validateForm() {
  const isTitleValid = validateField(
    bookTitle,
    validateBookTitle,
    'Book Title must be between 3 and 100 characters.'
  );

  const isAuthorValid = validateField(
    bookAuthor,
    validateBookAuthor,
    'Author must be between 3 and 100 characters.'
  );

  const isGenreValid = validateField(
    bookGenre,
    validateBookGenre,
    'Genre must be between 3 and 100 characters.'
  );

  const isYearValid = validateField(
    bookPublishYear,
    validateBookPublishYear,
    'Publish Year must be a 4-digit number.'
  );

  const isQuantityValid = validateField(
    bookQuantity,
    validateBookQuantity,
    'Quantity must be a number between 1 and 99.'
  );

  return isTitleValid && isAuthorValid && isGenreValid && isYearValid && isQuantityValid;
}

addDynamicValidation(
  bookTitle,
  validateBookTitle,
  'Book Title must be between 3 and 100 characters.'
);

addDynamicValidation(
  bookAuthor,
  validateBookAuthor,
  'Author must be between 3 and 100 characters.'
);

addDynamicValidation(
  bookGenre,
  validateBookGenre,
  'Genre must be between 3 and 100 characters.'
);

addDynamicValidation(
  bookPublishYear,
  validateBookPublishYear,
  'Publish Year must be a 4-digit number.'
);

addDynamicValidation(
  bookQuantity,
  validateBookQuantity,
  'Quantity must be a number between 1 and 99.'
);

bookForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (validateForm()) {
    const book = {
      id: generateId(),
      title: bookTitle.value,
      author: bookAuthor.value,
      genre: bookGenre.value,
      year: bookPublishYear.value,
      quantity: bookQuantity.value
    };

    books.push(book);
    addBook(book);
    saveToIndexedDB(book);
    clearForm();
  }
});

clearAllBtn.addEventListener('click', function () {
  clearForm();
});

function clearForm() {
  bookTitle.value = '';
  bookAuthor.value = '';
  bookGenre.value = '';
  bookPublishYear.value = '';
  bookQuantity.value = '';
}

function deleteFromIndexedDB(bookId) {
  const request = indexedDB.open('BookDatabase', 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('books', 'readwrite');
    const store = transaction.objectStore('books');
    store.delete(bookId);

    transaction.oncomplete = function () {
      console.log('Book deleted from IndexedDB:', bookId);
    };

    transaction.onerror = function () {
      console.error('Error deleting book from IndexedDB:', transaction.error);
    };
  };
}

function deleteBook(bookId) {
  books = books.filter(book => book.id != bookId);
  deleteFromIndexedDB(bookId);

  const row = document.getElementById(bookId);
  if (row){
    row.remove()
  };

  if(books.length == 0) {
    tableWrapper[0].style.display = 'none';
  }
}

editBookForm.insertAdjacentHTML('beforeend', allFormFields('edit'));

const formElements = editBookForm.querySelectorAll('.mdl-js-textfield, .mdl-button');
formElements.forEach(element => componentHandler.upgradeElement(element));

let editBookTitle = document.getElementById('editBookTitle');
let editBookAuthor = document.getElementById('editBookAuthor');
let editBookGenre = document.getElementById('editBookGenre');
let editBookPublishYear = document.getElementById('editBookPublishYear');
let editBookQuantity = document.getElementById('editBookQuantity');

document.addEventListener('click', function (event) {
  if (event.target.closest('.editBookBtn')) {

    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    dialog.showModal();

    const bookId = parseInt(event.target.closest('.editBookBtn').dataset.id);
    const book = books.find(book => book.id == bookId);

    if(book){
      editBookTitle.value = book.title;
      editBookAuthor.value = book.author;
      editBookGenre.value = book.genre;
      editBookPublishYear.value = book.year;
      editBookQuantity.value = book.quantity;

      editBookForm.setAttribute('data-editing-id', bookId);
    }
  }
});

document.addEventListener('click', function (event) {
  if (event.target.closest('.deleteFromTableBtn')) {
    const bookId = parseInt(event.target.closest('.deleteFromTableBtn').dataset.id);
    deleteBook(bookId);
  }
});

document.addEventListener('click', function (event) {
  if (event.target.closest('.close-edit-dialog')) {
    dialog.close();
  }
});


editBookForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const editingId = editBookForm.getAttribute('data-editing-id');
  const book = {
    id: editingId ? parseInt(editingId) : generateId(),
    title: bookTitle.value,
    author: bookAuthor.value,
    genre: bookGenre.value,
    year: bookPublishYear.value,
    quantity: bookQuantity.value,
  };

  if (editingId) {
    const bookIndex = books.findIndex(b => b.id === parseInt(editingId));
    books[bookIndex] = book;

    updateBookInIndexedDB(book);
    editBookForm.removeAttribute('data-editing-id');
    
  } else {
    // Add new book
    books.push(book);
    saveToIndexedDB(book); // Save to IndexedDB
  }

  addBook(book); // Update or add row in table
  clearForm();
});

function updateBookInIndexedDB(book) {
  const request = indexedDB.open('BookDatabase', 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('books', 'readwrite');
    const store = transaction.objectStore('books');
    store.put(book); // `put` updates an existing entry or adds a new one

    transaction.oncomplete = function () {
      console.log('Book updated in IndexedDB:', book);
    };

    transaction.onerror = function () {
      console.error('Error updating book in IndexedDB:', transaction.error);
    };
  };
}


// document.addEventListener('booksUpdated', () => {
//   for(let bookCount = 0; bookCount < books.length; bookCount++){
//   }
// });