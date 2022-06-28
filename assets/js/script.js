/*
[
    {
        id: string | number,
        title: string,
        author: string,
        year: number,
        isComplete: boolean
    }
]
*/

let books = [];
const STORAGE_KEY = "BOOKSHELF";
const RENDER_EVENT = "BOOKSHELF_RENDER";

const checkStorage = () => {
  if (Storage === "undefined") {
    alert("Browser tidak mendukung local storage, data tidak dapat tersimpan!");
    return false;
  }
  return true;
};

const loadBookFromStorage = () => {
  const storage = localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)) : [];
  for (const book of storage) {
    books.push(book);
  }
};

const makeCard = (id, title, author, year, isComplete) => {
  const card = document.createElement("div");
  card.classList.add("w-full", "bg-white", "shadow", "rounded-lg", "px-2", "py-2", "border-l-2", "border-blue-500");
  card.innerHTML = `
        <h1 class="text-lg text-black font-semibold">${title}</h1>
        <p class="text-sm text-gray-600">Penulis : ${author}</p>
        <p class="text-sm text-gray-600">Tahun terbit : ${year}</p>
    `;

  const editButton = document.createElement("button");
  editButton.innerHTML = `Edit`;
  editButton.classList.add("px-2", "py-0.5", "rounded-lg", "bg-yellow-500", "text-white", "text-sm", "shadow", "transition", "duration-300", "hover:bg-yellow-600", "focus:outline-none", "focus:ring-2", "focus:ring-yellow-500", "focus:border-yellow-400");
  editButton.addEventListener("click", () => {
    editBook(id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `Hapus`;
  deleteButton.classList.add("mx-1", "px-2", "py-0.5", "rounded-lg", "bg-red-500", "text-white", "text-sm", "shadow", "transition", "duration-300", "hover:bg-red-600", "focus:outline-none", "focus:ring-2", "focus:ring-red-500", "focus:border-red-400");
  deleteButton.addEventListener("click", () => {
    if (confirm(`Apakah anda yakin ingin menghapus buku ${title}?`) == true) {
      deleteBook(id);
    }
  });

  const checkButton = document.createElement("button");
  checkButton.innerHTML = isComplete ? `Belum Selesai Dibaca` : `Selesai Dibaca`;
  checkButton.classList.add("px-2", "py-0.5", "rounded-lg", "bg-teal-400", "text-white", "text-sm", "shadow", "transition", "duration-300", "hover:bg-teal-500", "focus:outline-none", "focus:ring-2", "focus:ring-teal-400", "focus:border-teal-300")
  checkButton.addEventListener("click", () => {
    if (confirm(`Apakah anda yakin ingin memindahkan buku ${title} ke rak ${isComplete ? `Belum Selesai Dibaca` : `Selesai Dibaca`}?`) == true) {
      if (isComplete) {
        setBookUnreaded(id);
      } else {
        setBookReaded(id);
      }
    }
  });

  card.append(editButton, deleteButton, checkButton);
  return card;
};

const showAlert = (msg) => {
  const alert = document.querySelector("#alert");
  alert.classList.remove("hidden");
  alert.innerText = msg;

  setTimeout(() => {
    removeAlert();
  }, 3000)
}

const removeAlert = () => {
  const alert = document.querySelector("#alert");
  alert.classList.add("hidden");
  alert.innerText = "";
}

const findBook = (id) => {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
};

const findBookIndex = (id) => {
  for (let index in books) {
    if (books[index].id === id) {
      return index;
    }
  }
  return -1;
};

const saveBook = () => {
  if (checkStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
};

const refreshForm = () => {
  form.removeEventListener("submit", editBookAction);
  form.addEventListener("submit", addBookAction);
  form.classList.toggle("hidden");
  clearInput();
  document.querySelector("#add-button > span").innerText = "Tambah Buku";
  const cancelButton = document.querySelector("#cancel-button");
  if (cancelButton !== null) {
    form.removeChild(cancelButton);
  }
  const inputId = document.querySelector("#input-id");
  if (inputId !== null) {
    form.removeChild(inputId);
  }
};

const clearInput = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#year").value = "";
  document.querySelector("#isComplete").checked = false;
};

const addBookAction = (e) => {
  e.preventDefault();
  addBook();
};

const editBookAction = (e) => {
  e.preventDefault();
  updateBook();
};

const addBook = () => {
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const year = document.querySelector("#year").value;
  const isComplete = document.querySelector("#isComplete").checked;

  books.push({
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  });

  saveBook();
  clearInput();
  refreshForm();
  showAlert(`Berhasil menambahkan buku dengan judul "${title}"`);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const updateBook = () => {
  const id = document.querySelector("#input-id").value;
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const year = document.querySelector("#year").value;
  const isComplete = document.querySelector("#isComplete").checked;

  const book = findBook(parseInt(id));
  if (book == null) return;

  book.title = title;
  book.author = author;
  book.year = year;
  book.isComplete = isComplete;

  saveBook();
  clearInput();
  refreshForm();
  showAlert(`Berhasil mengubah data buku "${title}"`);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const setBookReaded = (id) => {
  const book = findBook(id);
  if (book == null) return;

  book.isComplete = true;

  saveBook();
  showAlert(`Berhasil memindahkan buku "${book.title}" ke rak selesai dibaca`);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const setBookUnreaded = (id) => {
  const book = findBook(id);
  if (book == null) return;

  book.isComplete = false;

  saveBook();
  showAlert(`Berhasil memindahkan buku "${book.title}" ke rak belum selesai dibaca`);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const editBook = (id) => {
  const book = findBook(id);
  if (book == null) return;

  form.classList.remove("hidden");

  form.removeEventListener("submit", addBookAction);
  form.addEventListener("submit", editBookAction);

  const cancelButton = document.createElement("button");
  cancelButton.innerHTML = `Batal`;
  cancelButton.type = "button";
  cancelButton.id = "cancel-button";
  cancelButton.classList.add("px-2", "py-1", "text-sm", "rounded-lg", "bg-gray-500", "text-white", "shadow", "transition", "duration-300", "hover:bg-gray-600")
  cancelButton.addEventListener("click", () => {
    refreshForm();
  });

  const inputId = document.createElement("input");
  inputId.type = "hidden";
  inputId.id = "input-id";
  inputId.value = book.id;

  const findCancelButton = document.querySelector("#cancel-button") == null ? true : false;
  if (findCancelButton) {
    form.append(cancelButton);
  }

  const findInputId = document.querySelector("#input-id") == null ? true : false;
  if (findInputId) {
    form.append(inputId);
  }

  document.querySelector("#add-button > span").innerText = "Edit Buku";

  document.querySelector("#title").value = book.title;
  document.querySelector("#author").value = book.author;
  document.querySelector("#year").value = book.year;
  document.querySelector("#isComplete").checked = book.isComplete;
};

const deleteBook = (id) => {
  const bookDetail = findBook(id);
  const book = findBookIndex(id);
  if (book === -1) return;

  books.splice(book, 1);

  saveBook();
  showAlert(`Berhasil menghapus buku "${bookDetail.title}" dari rak`)
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const searchBooks = () => {
  const state = books;

  if (search.value !== "") {
    const filter = books.filter((book) => { return (book.title.toLowerCase().search(`${search.value.toLowerCase()}`) !== -1); });
    books = filter;
  }

  const searchAlert = document.querySelector("#search-alert");
  if (!books.length > 0) {
    searchAlert.innerText = `Judul "${search.value}" tidak ditemukan`;
  } else {
    searchAlert.innerText = "";
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  books = state;
}

const addButton = document.querySelector("#add-button");
addButton.addEventListener("click", () => {
  form.classList.toggle("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  if (checkStorage()) {
    loadBookFromStorage();
  }
  document.dispatchEvent(new Event(RENDER_EVENT));

  const form = document.querySelector("#form");
  form.addEventListener("submit", addBookAction);

  const search = document.querySelector("#search");
  search.addEventListener("input", (e) => {
    e.preventDefault();
    searchBooks();
  })

  const copyright = document.querySelector("#copyright");
  copyright.innerHTML = new Date().getFullYear();
});

document.addEventListener(RENDER_EVENT, () => {
  const unreaded = document.querySelector("#unreaded");
  const readed = document.querySelector("#readed");

  unreaded.innerHTML = "";
  readed.innerHTML = "";

  for (const book of books) {
    const card = makeCard(book.id, book.title, book.author, book.year, book.isComplete);
    if (book.isComplete) {
      readed.append(card);
    } else {
      unreaded.append(card);
    }
  }
});
