import { ref, toValue, watch } from "vue";

const db = await initDB();
const notes = ref(await getNotes());
const currentNote = ref(notes.value?.[0] ?? null);

async function initDB() {
    return new Promise((resolve, reject) => {
        let db = window.indexedDB.open('hardnote', 7);
        db.onsuccess = e => {
            resolve(e.target.result)
        }

        db.onerror = e => {
            reject('error on db init');
        }

        db.onupgradeneeded = e => {
            e.target.result.createObjectStore('hardnote', {keyPath: "date"});
        }
    })
}


async function storeNote(noteContent, date = null) {
    return new Promise((resolve, reject) => {
        let op = db.transaction('hardnote', 'readwrite').objectStore('hardnote');

        op.onerror = e => {
            reject('transaction error');
        };

        let timeNow = new Date();
        let currentNote = {
            note: noteContent,
            date: date || timeNow.getTime() // Use the date of the selected note if it exists
        }

        // Check if the note already exists
        let getNote = op.get(currentNote.date);
        getNote.onsuccess = e => {
            if (e.target.result) {
                // If the note exists, update it
                let updateNote = op.put(currentNote);
                updateNote.onsuccess = e => {
                    refreshNotes();
                    resolve();
                };
                updateNote.onerror = e => {
                    refreshNotes();
                    reject('updating error');
                };
            } else {
                // If note doesn't exist, add it
                let addNote = op.add(currentNote);
                addNote.onsuccess = e => {
                    refreshNotes();
                    resolve();
                };
                addNote.onerror = e => {
                    refreshNotes();
                    reject('adding error');
                };
            }
        };
        getNote.onerror = e => {
            refreshNotes();
            reject('retrieving error');
        };
    })
}

async function getNotes() {
    return new Promise((resolve, reject) => {
        db.transaction('hardnote')
            .objectStore('hardnote')
            .getAll()
            .onsuccess = e => {
                resolve(e.target.result ?? []);
            }
    });
}

async function refreshNotes() {
    notes.value = await getNotes();
}

async function deleteNote(noteId = null) {
    const note = toValue(noteId);
    return new Promise((resolve, reject) => {
        let op = db.transaction('hardnote', 'readwrite').objectStore('hardnote');

        op.onerror = e => {
            refreshNotes();
            reject('transaction error');
        };

        // Check if the note already exists
        let getNote = op.get(note?.date ?? noteId);
        console.log('Deleting note', getNote);

        getNote.onsuccess = e => {
            if (e.target.result) {
                // If the note exists, delete it
                let deleteNote = op.delete(getNote.result.date);
                deleteNote.onsuccess = e => {
                    refreshNotes();
                    // Since we deleted the current note,
                    // we need to set the current note to a fallback.
                    currentNote.value = notes.value[0];
                    resolve();
                };

                deleteNote.onerror = e => {
                    refreshNotes();
                    reject('delete error');
                };
            }
        };
        getNote.onerror = e => {
            refreshNotes();
            reject('retrieving error');
        };
    })
}

async function getNoteById(noteId) {
    if (typeof noteId === 'object' && noteId?.date !== null) {
        noteId = noteId.date;
    }

    return new Promise((resolve, reject) => {
        let op = db.transaction('hardnote', 'readwrite').objectStore('hardnote');

        op.onerror = e => {
            reject('transaction error');
        };

        // Check if the note already exists
        let getNote = op.get(noteId);
        getNote.onsuccess = e => {
            resolve(e.target.result);
        };

        getNote.onerror = e => {
            resolve(null);
        };
    });
};

async function setCurrentNote(note) {
    currentNote.value = await getNoteById(note.date);
}

function isCurrentNote(note) {
    return currentNote.value?.date === note.date;
}

watch(notes, (newNotes, oldNotes) => {
    if (newNotes.length > oldNotes.length) {
        currentNote.value = newNotes[newNotes.length - 1];
    }

    if (newNotes.length === 0) {
        currentNote.value = null;
    }
})

export default function() {
    return {
        notes,
        storeNote,
        deleteNote,
        currentNote,
        setCurrentNote,
        isCurrentNote
    }
}