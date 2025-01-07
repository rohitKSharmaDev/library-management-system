function initIndexedDB() {
  const request = indexedDB.open('BookDatabase', 1);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('books')) {
      db.createObjectStore('books', { keyPath: 'id' });
    }
  };

  request.onerror = function () {
    console.error('IndexedDB initialization failed.');
  };

  request.onsuccess = function () {
    console.log('IndexedDB initialized successfully.');
  };
}

initIndexedDB();