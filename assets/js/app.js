const bookForm = document.getElementById('bookForm');

let allFormFields = (usedFor = 'default') => {
  return `
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="${usedFor != 'default' ? 'editB' : 'b'}ookTitle" placeholder="Enter Book Title">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookTitle">
        Book Title
      </label>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="${usedFor != 'default' ? 'editB' : 'b'}ookAuthor" placeholder="Enter Book Author">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookAuthor">
        Author
      </label>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="${usedFor != 'default' ? 'editB' : 'b'}ookGenre" placeholder="Enter Book Genre">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookGenre">
        Genre
      </label>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="number" id="${usedFor != 'default' ? 'editB' : 'b'}ookPublishYear" placeholder="Enter Publish Year">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookPublishYear">
        Year
      </label>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="number" id="${usedFor != 'default' ? 'editB' : 'b'}ookQuantity" placeholder="Enter Book Quantity">
      <label class="mdl-textfield__label" for="${usedFor != 'default' ? 'editB' : 'b'}ookQuantity">
        Quantity
      </label>
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

let bookTitle = document.getElementById('bookTitle');
let bookAuthor = document.getElementById('bookAuthor');
let bookGenre = document.getElementById('bookGenre');
let bookPublishYear = document.getElementById('bookPublishYear');
let bookQuantity = document.getElementById('bookQuantity');

const editBookForm = document.getElementById('editBookForm');

let dialog = document.querySelector('dialog');

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

bookForm.addEventListener('submit', function (event) {
  event.preventDefault();

  let book = {
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