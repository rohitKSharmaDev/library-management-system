let books = [];

function loadBooks() {
  const request = indexedDB.open('BookDatabase', 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('books', 'readonly');
    const store = transaction.objectStore('books');

    const getAllRequest = store.getAll();
    getAllRequest.onsuccess = function () {
      books = getAllRequest.result; // Load books into the global array
      books.forEach(book => addBook(book)); // Add books to the table
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
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored show-modal editFromTableBtn" data-id='${book.id}'>
          <i class="material-icons">edit</i>
        </button>

        <button class="mdl-button mdl-js-button mdl-button--fab deleteFromTableBtn" data-id='${book.id}'>
          <i class="material-icons">delete</i>
        </button>
      </td>
    </tr>
  `);
}

let dialog = document.querySelector('dialog');

let showModalButton = document.querySelector('.show-modal');

if (!dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}

showModalButton.addEventListener('click', function () {
  dialog.showModal();
});

dialog.querySelector('.close').addEventListener('click', function () {
  dialog.close();
});

let bookTitle = document.getElementById('bookTitle');
let bookAuthor = document.getElementById('bookAuthor');
let bookGenre = document.getElementById('bookGenre');
let bookPublishYear = document.getElementById('bookPublishYear');
let bookQuantity = document.getElementById('bookQuantity');

function clearForm() {
  bookTitle.value = '';
  bookAuthor.value = '';
  bookGenre.value = '';
  bookPublishYear.value = '';
  bookQuantity.value = '';
}

function generateId() {
  return Math.floor(Math.random() * 100000); 
}

const clearAllBtn = document.getElementById('clearAllBtn');
clearAllBtn.addEventListener('click', function() {
  clearForm();
});

const bookForm = document.getElementById('bookForm');
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

