<template>
    <div class="flex w-screen h-screen">

        <div class="sidebar-container py-4 w-1/4 border-r-2 border-gray-300 flex flex-col flex-shrink-0 bg-gray-200">
            <div v-if="showSuccess" class="success-msg flex space-x-2 text-white bg-green-500 rounded-full p-2 z-10 mb-2 bg-opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

                <span class="pr-2">Success!</span>
            </div>
            <div class="sidebar-content">
                <div class="flex  justify-between m-2 p-2">
                <button @click="allNotes" class="text-gray-bg-gray-500 p-2 hover:bg-gray-100 cursor-pointer">All Notes</button>
                 <button @click="newNote">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                         <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>

                 </button>
                </div>
                <div class="flex justify-center items-center flex-col space-x-4 lg:overflow-y-scroll">
                <a
                    @click="showNote(note)"
                    v-for="note in savedNotes"
                    :key="note.date"
                    class="p-2 mb-3 block hover:bg-gray-100 cursor-pointer "
                    :class="{'bg-gray-100': selectedNote === note}">
                    {{new Date(note.date).toLocaleString()}}
                </a>
                </div>
            </div>

        </div>
        <div v-if="clientOffline" class="offline-notice bg-red-500 opacity-80 text-center text-white w-1/4 h-[10%] z-10 absolute mb-2 flex items-center space-x-2 p-2">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>


            <span>Unable to sync, looks like you are currently offline </span>


        </div>

        <div v-if="!clientOffline && showOnline" class="offline-notice bg-green-500 opacity-80 text-center text-white w-1/4 h-[10%] z-10 absolute mb-2 flex items-center space-x-2 p-2">

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>


            <span>Back online! </span>


        </div>


        <article class="ml-4 prose lg:prose-xl w-3/4 flex overflow-auto">

            <Tiptap @note-content="grabHTML" :shown-note="shownNote" :clear-note="clearContent" />
            <div class="flex-grow"></div>
            <div class="btns absolute bottom-2 right-0 flex space-x-4">
            <button @click="store" :disabled="!noteContent" class="mr-4 text-white rounded-full bg-green-500 outline-none hover:scale-110 disabled:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 p-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                </svg>

            </button>

            <button v-if="Object.keys(selectedNote).length" @click="deleteNote" class="text-white rounded-full bg-red-500 outline-none hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 p-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>


            </button>
                </div>


        </article>

    </div>



</template>

<script setup>

import Tiptap from "@/components/Tiptap.vue";
import {onMounted, ref, watch, watchEffect} from "vue";

const db = ref(null);
const showSuccess = ref(false);
const noteContent = ref(null);
const savedNotes = ref([]);
const selectedNote = ref({})
const clearContent = ref(false);
const clientOffline = ref(!navigator.onLine);
const showOnline = ref(false);
const shownNote = ref({note: null});


window.addEventListener('online', () => {
        clientOffline.value = false;
        showOnline.value = true;
        setTimeout(() => {
            showOnline.value= false;
        }, 4000);

    }
);

window.addEventListener('offline', () => {
        clientOffline.value = true;
    }
);


const grabHTML = (html) => {
    noteContent.value = html;
}

async function initDB() {
    return new Promise((resolve, reject)=>{
        let db = window.indexedDB.open('hardnote',7);
        db.onsuccess = e =>{
            resolve(e.target.result)
        }

        db.onerror = e =>{
            reject('error on db init');

        }

        db.onupgradeneeded = e =>{
            e.target.result.createObjectStore('hardnote', {keyPath:"date"});

        }
    })
}

async function store(){
    return new Promise((resolve, reject)=>{
        let op = db.value.transaction('hardnote', 'readwrite').objectStore('hardnote');

        op.onerror = e =>{
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
                    showSuccess.value = true;
                    setTimeout(()=>{
                        showSuccess.value=false;
                    }, 4000)
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
                    showSuccess.value = true;
                    setTimeout(()=>{
                        showSuccess.value=false;
                    }, 4000)
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

async function grabNotes(){
    return new Promise((resolve, reject) => {
        db.value.transaction('hardnote')
            .objectStore('hardnote')
            .getAll()
            .onsuccess = e => {
            resolve(e.target.result);
        }
    });
}


function showNote(note){
    shownNote.value = note;
    selectedNote.value = note;
}

function allNotes(){

    // cleanup
    clearContent.value = true

    selectedNote.value = {};

    setTimeout(()=>{
        clearContent.value = false;

    }, 500)

}

function newNote(){
    return new Promise((resolve, reject)=>{
        let op = db.value.transaction('hardnote', 'readwrite');
        op.oncomplete = e => {
            resolve();
            showSuccess.value = true;
            setTimeout(()=>{
                showSuccess.value=false;
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

// check if note is saved

// const inSaved = () => {
//
//  return  Object.keys(selectedNote).some(note =>
//         savedNotes.value.some(obj => obj.hasOwnProperty(note) && obj[note])
//     );
// }

//delete note here

async function deleteNote(){
    return new Promise((resolve, reject)=>{
        let op = db.value.transaction('hardnote', 'readwrite').objectStore('hardnote');

        op.onerror = e =>{
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

                    clearContent.value = true

                    selectedNote.value = {};

                    setTimeout(()=>{
                        clearContent.value = false;

                    }, 500)

                    resolve();
                    //window.location.reload();

                    showSuccess.value = true;
                    setTimeout(()=>{
                        showSuccess.value=false;
                    }, 4000)
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


watchEffect(() =>{
    if (noteContent.value === '<p></p>')
        noteContent.value= null;
})


onMounted( async () => {

    db.value = await initDB();
    let notes = await grabNotes();
    savedNotes.value =notes.reverse();

});
    // watchEffect(() => {
    // disableSave.value = !noteContent.value;
    //
    // });
</script>

<style>

</style>
