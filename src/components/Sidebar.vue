<script setup>

const props = defineProps({
    newNote: Function,
    showNote: Function,
    savedNotes: Array,
    selectedNote: Object
})

</script>

<template>
    <div class="sidebar-content">
        <div class="flex justify-between m-2 p-2">
            <button class="text-gray-bg-gray-500 p-2">All
                Notes
            </button>
            <button @click="newNote">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
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
                {{ new Date(note.date).toLocaleString() }}
            </a>
        </div>
    </div>

</template>

<style scoped>

</style>