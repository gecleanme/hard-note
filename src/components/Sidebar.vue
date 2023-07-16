<script setup>

import {computed} from "vue";
import useNotes from "@/composables/useNotes";

const { storeNote, isCurrentNote, setCurrentNote, notes, currentNote } = useNotes();

const formattedNotes = computed(() => {
    console.log('notes reformatted for sidebar')
    return notes.value.map(note => ({
        ...note, formattedDate: new Date(note.date).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }));
});
</script>

<template>
    <div class="sidebar-content overflow-y-auto">
        <div class="flex justify-between m-2 p-2">
            <button class="text-gray-bg-gray-500 p-2">All
                Notes
            </button>
        </div>
        <div class="flex justify-center items-center justify-items-center space-x-2"
             @click="setCurrentNote(note)"
             v-for="note in formattedNotes"
             :key="note.date"
             :class="{'bg-gray-200': isCurrentNote(note)}"
        >

            <svg v-if="isCurrentNote(note)" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor"
                 class="w-6 h-6"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>


            <a
                class="p-2 block hover:bg-gray-300 cursor-pointer"
            >
                {{ note.formattedDate }}
            </a>
        </div>

        <div v-if="!Object.keys(formattedNotes).length"
             class="justify-center text-center text-black text-md"
        >
            No Notes to show
        </div>

    </div>
</template>
