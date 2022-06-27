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

const books = [];
const STORAGE_KEY = "BOOKSHELF";
const RENDER_EVENT = "BOOKSHELF_RENDER";

const checkStorage = () => {
    if (Storage === "undefined") {
        alert('Browser tidak mendukung local storage, data tidak dapat tersimpan!');
        return false;
    }
    return true;
}

const loadBookFromStorage = () => {
    const storage = localStorage.getItem(STORAGE_KEY) ? JSON.parse(localStorage.getItem(STORAGE_KEY)) : [];
    for (const book of storage) {
        books.push(book);
    }
}

const makeCard = (id, title, author, year, isComplete) => {
    const card = document.createElement("div");
    card.classList.add('border-4', 'border-black');
    card.innerHTML = `
        <h1>${title}</h1>
        <p>Penulis : ${author}</p>
        <p>Tahun terbit : ${year}</p>
    `;

    const editButton = document.createElement("button");
    editButton.innerHTML = `Edit`;
    editButton.addEventListener('click', () => {
        editBook(id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `Hapus`;
    deleteButton.addEventListener('click', () => {
        deleteBook(id);
    });

    const checkButton = document.createElement("button");
    checkButton.innerHTML = isComplete ? `Belum Selesai Dibaca` : `Selesai Dibaca`;
    checkButton.addEventListener('click', () => {
        if (isComplete) {
            setBookUnreaded(id);
        } else {
            setBookReaded(id);
        }
    });

    card.append(editButton, deleteButton, checkButton);
    return card;
}

const findBook = (id) => {
    for (const book of books) {
        if (book.id === id) {
            return book;
        }
    }
    return null;
}

const findBookIndex = (id) => {
    for (let index in books) {
        if (books[index].id === id) {
            return index;
        }
    }
    return -1;
}

const saveBook = () => {
    if (checkStorage()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
}

const refreshForm = () => {
    form.removeEventListener('submit', editBookAction);
    form.addEventListener('submit', addBookAction);
    clearInput();
    const cancelButton = document.querySelector("#cancel-button");
    if (cancelButton !== null) {
        form.removeChild(cancelButton);
    }
    const inputId = document.querySelector("#input-id");
    if (inputId !== null) {
        form.removeChild(inputId);
    }
}

const clearInput = () => {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#year").value = "";
    document.querySelector("#isComplete").checked = false;
}

const addBookAction = (e) => {
    e.preventDefault();
    alert('Ini add book');
    // addBook();
}

const editBookAction = (e) => {
    e.preventDefault();
    alert('ini edit book');
}

const addBook = () => {
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const year = document.querySelector('#year').value;
    const isComplete = document.querySelector('#isComplete').checked;

    books.push({
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    });

    saveBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const setBookReaded = (id) => {
    const book = findBook(id);
    if (book == null) return;

    book.isComplete = true;

    saveBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const setBookUnreaded = (id) => {
    const book = findBook(id);
    if (book == null) return;

    book.isComplete = false;

    saveBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const editBook = (id) => {
    const book = findBook(id);
    if (book == null) return;

    form.classList.remove('hidden');

    form.removeEventListener('submit', addBookAction);
    form.addEventListener('submit', editBookAction);

    const cancelButton = document.createElement("button");
    cancelButton.innerHTML = `Batal`;
    cancelButton.type = 'button';
    cancelButton.id = "cancel-button";
    cancelButton.addEventListener('click', () => {
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

    document.querySelector("#title").value = book.title;
    document.querySelector("#author").value = book.author;
    document.querySelector("#year").value = book.year;
    document.querySelector("#isComplete").checked = book.isComplete;
}

const deleteBook = (id) => {
    const book = findBookIndex(id);
    if (book === -1) return;

    books.splice(book, 1);

    saveBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const addButton = document.querySelector('#add-button');
addButton.addEventListener('click', () => {
    form.classList.toggle('hidden');
})

document.addEventListener('DOMContentLoaded', () => {
    if (checkStorage()) {
        loadBookFromStorage();
    }
    document.dispatchEvent(new Event(RENDER_EVENT));

    const form = document.querySelector('#form');
    form.addEventListener('submit', addBookAction);
});

document.addEventListener(RENDER_EVENT, () => {
    const unreaded = document.querySelector("#unreaded");
    const readed = document.querySelector("#readed");

    unreaded.innerHTML = '';
    readed.innerHTML = '';

    for (const book of books) {
        const card = makeCard(book.id, book.title, book.author, book.year, book.isComplete);
        if (book.isComplete) {
            readed.append(card);
        } else {
            unreaded.append(card);
        }
    }
});