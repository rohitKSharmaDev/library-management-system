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

let books = [];

function addBook(book) {
  let table = document.querySelector('#addedBooksTable tbody');
  table.append(`
    <tr id="${book.id}">
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.year}</td>
      <td>${book.quantity}</td>
      <td>
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored editFromTableBtn" data-id='${book.id}'>
          <i class="material-icons">edit</i>
        </button>
      </td>
      <td>
        <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored deleteFromTableBtn" data-id='${book.id}'>
          <i class="material-icons">delete</i>
        </button>
      </td>
    </tr>
  `)
}

function clearForm() {
  let bookTitle = document.getElementById('bookTitle');
}