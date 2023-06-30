<template>
    <div class="flex w-screen h-screen">

        <div class="sidebar-container py-4 w-1/4 border-r-2 border-gray-300 items-center flex flex-col flex-shrink-0 bg-gray-200">
            <div v-if="showSuccess" class="success-msg flex space-x-2 text-white bg-green-500 rounded-full p-2 z-10 mb-2 bg-opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

                <span class="pr-2">Note Saved!</span>
            </div>
            <div class="sidebar-content">
                <a v-for="note in savedNotes" :key="note.date" class="mb-2 block hover:bg-gray-100 cursor-pointer">{{new Date(note.date).toLocaleString()}}</a>
            </div>

        </div>
        <article class="ml-4 prose lg:prose-xl w-3/4 flex overflow-auto">
            <Tiptap @note-content="grabHTML"/>
            <div class="flex-grow"></div>
            <button @click="store" class="absolute bottom-2 right-0 mr-4 text-white rounded-full bg-green-500 outline-none hover:scale-110 disabled:bg-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 p-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                </svg>

            </button>

        </article>

    </div>



</template>

<script setup>

import Tiptap from "@/components/Tiptap.vue";
import {onMounted, ref} from "vue";

const db = ref(null);
const showSuccess = ref(false);
const noteContent = ref(null);
const savedNotes = ref([]);

const grabHTML = (html) => {
    noteContent.value = html;
}

async function initDB() {
    return new Promise((resolve, reject)=>{
        let db = window.indexedDB.open('hardnote',6);
        db.onsuccess = e =>{
            resolve(e.target.result)
        }

        db.onerror = e =>{
            reject('error on db init');

        }

        db.onupgradeneeded = e =>{
            e.target.result.deleteObjectStore('hardnote');
            e.target.result.createObjectStore('hardnote', {keyPath:"date"});

        }
    })
}

async function store(){
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
            note: noteContent.value,
            date: timeNow.getTime()
        }
        savedNotes.value.unshift(currentNote);
        op.objectStore('hardnote').add(currentNote)

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

//grab notes here

onMounted( async () => {

    db.value = await initDB();
    let notes = await grabNotes();
    savedNotes.value =notes.reverse();

});
</script>

<style>

</style>
