<template>

    <Blinkr message="Success" type="success" v-if="showSuccess"></Blinkr>

    <Blinkr message="Saving..." type="info" v-if="saveSuccess"></Blinkr>



    <div class="flex w-screen h-screen overflow-y-hidden">

        <div class="py-4 w-1/4 border-r-2 border-gray-300 flex flex-col flex-shrink-0 bg-gray-200">

            <Sidebar :new-note="newNote" :saved-notes="savedNotes" :selected-note="selectedNote"
                     :show-note="showNote"></Sidebar>
        </div>


        <OnlineStatus></OnlineStatus>

        <article class="ml-4 prose lg:prose-xl w-3/4 flex overflow-visible">

            <Tiptap @note-content="grabHTML" :shown-note="shownNote" :clear-note="clearContent"/>
            <div class="flex-grow"></div>
            <div class="btns absolute bottom-9 right-2 flex space-x-4">

                <button v-if="Object.keys(selectedNote).length" @click="deleteNote"
                        class="text-white rounded-full bg-red-500 outline-none hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="w-16 h-16 p-2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                    </svg>


                </button>
            </div>

            <div class="block z-20 text-gray-400 p-2 mt-6 absolute bottom-0 right-0 text-sm">Notes are Auto-saved</div>


        </article>


    </div>


</template>

<script setup>

import Tiptap from "@/components/Tiptap.vue";
import {onMounted, ref, watch, watchEffect} from "vue";
import Blinkr from "@/components/Blinkr.vue";
import OnlineStatus from "@/components/onlineStatus.vue";
import Sidebar from "@/components/Sidebar.vue";
import {debounce} from "lodash";

const db = ref(null);
const showSuccess = ref(false);
const noteContent = ref(null);
const savedNotes = ref([]);
const selectedNote = ref({})
const clearContent = ref(false);
const shownNote = ref({note: null});
const debounceStore = debounce(store,1000);
const saveSuccess = ref(false);


const grabHTML = (html) => {
    noteContent.value = html;
}

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

async function store() {
    return new Promise((resolve, reject) => {
        let op = db.value.transaction('hardnote', 'readwrite').objectStore('hardnote');

        op.onerror = e => {
            reject('transaction error');
        };

        let timeNow = new Date();
        let currentNote = {
            note: noteContent.value,
            date: selectedNote.value.date || timeNow.getTime() // Use the date of the selected note if it exists
        }

        // Check if the note already exists
        let getNote = op.get(currentNote.date);
        getNote.onsuccess = e => {
            if (e.target.result) {
                // If the note exists, update it
                let updateNote = op.put(currentNote);
                updateNote.onsuccess = e => {
                    // fetch the note in savedNotes and replace it with the updated one
                    let noteIndex = savedNotes.value.findIndex(note => note.date === currentNote.date);
                    if (noteIndex !== -1) {
                        savedNotes.value[noteIndex] = currentNote;
                    }
                    showNote(currentNote);

                    resolve();

                    saveSuccess.value = true;
                    setTimeout(() => {
                        saveSuccess.value = false;
                        showSuccess.value = true;

                    }, 1000)

                    setTimeout(() => {
                        showSuccess.value = false;
                    }, 1500)

                };
                updateNote.onerror = e => {
                    reject('updating error');
                };
            } else {
                // If note doesn't exist, add it
                let addNote = op.add(currentNote);
                addNote.onsuccess = e => {
                    savedNotes.value.unshift(currentNote);
                    selectedNote.value = currentNote;
                    resolve();

                    saveSuccess.value = true;
                    setTimeout(() => {
                        saveSuccess.value = false;
                        showSuccess.value = true;

                    }, 1000)

                    setTimeout(() => {
                        showSuccess.value = false;
                    }, 1500)

                };
                addNote.onerror = e => {
                    reject('adding error');
                };
            }
        };
        getNote.onerror = e => {
            reject('retrieving error');
        };
    })
}

async function grabNotes() {
    return new Promise((resolve, reject) => {
        db.value.transaction('hardnote')
            .objectStore('hardnote')
            .getAll()
            .onsuccess = e => {
            resolve(e.target.result);
        }
    });
}


function showNote(note) {
    shownNote.value = note;
    selectedNote.value = note;
}

async function newNote() {
    return new Promise((resolve, reject) => {
        let op = db.value.transaction('hardnote', 'readwrite');
        op.oncomplete = e => {
            resolve();
            showSuccess.value = true;
            setTimeout(() => {
                showSuccess.value = false;
            }, 4000)
        }

        let timeNow = new Date();
        let currentNote = {
            note: '<p></p>',
            date: timeNow.getTime()
        }
        savedNotes.value.unshift(currentNote);
        selectedNote.value = currentNote
        showNote(currentNote);
        op.objectStore('hardnote').add(currentNote)

    })
}

async function deleteNote() {
    return new Promise((resolve, reject) => {
        let op = db.value.transaction('hardnote', 'readwrite').objectStore('hardnote');

        op.onerror = e => {
            reject('transaction error');
        };

        let currentNote = {
            note: noteContent.value,
            date: selectedNote.value.date
        }

        // Check if the note already exists
        let getNote = op.get(currentNote.date);

        getNote.onsuccess = e => {
            if (e.target.result) {
                // If the note exists, delete it
                let deleteNote = op.delete(currentNote.date);
                deleteNote.onsuccess = e => {
                    // delete from saved array
                    let noteIndex = savedNotes.value.findIndex(note => note.date === currentNote.date);
                    if (noteIndex !== -1) {
                        savedNotes.value.splice(noteIndex, 1);
                    }

                    resolve();

                    showSuccess.value = true;
                    setTimeout(() => {
                        showSuccess.value = false;
                    }, 4000)

                    showNote(savedNotes.value[0]);
                };

                deleteNote.onerror = e => {
                    reject('delete error');
                };
            }
        };
        getNote.onerror = e => {
            reject('retrieving error');
        };
    })
}


watchEffect(() => {
    if (noteContent.value === '<p></p>')
        noteContent.value = null;
})

watch(noteContent, (newVal) => {
    if (newVal){
        debounceStore();
    }
})


onMounted(async () => {

    db.value = await initDB();
    let notes = await grabNotes();
    savedNotes.value = notes.reverse();

});
</script>