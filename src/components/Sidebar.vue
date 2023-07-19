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
    })).sort((a, b) => b.date - a.date);
});
</script>

<template>
    <div class="sidebar-content flex flex-col gap-1 flex-grow ">
        <div class="flex flex-col h-full">
          <div class="transition-all duration-150 mx-3 rounded-md  flex justify-center items-center hover:bg-gray-200 justify-items-center space-x-2"
               @click="setCurrentNote(note)"
               @dblclick="storeNote('',null)"
               v-for="note in formattedNotes"
               :key="note.date"
               :class="{'bg-gray-200': isCurrentNote(note)}"
          >

            <svg  xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor"
                  class="w-6 h-6"
                  :class="[isCurrentNote(note)?'opacity-100':'opacity-0']"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>


            <a
                class="p-2 block  cursor-pointer"
            >
              {{ note.formattedDate }}
            </a>
          </div>
        </div>

        <div v-if="!Object.keys(formattedNotes).length"
             class="justify-center text-center text-black text-md"
        >
            No notes yet
        </div>

    </div>
</template>
