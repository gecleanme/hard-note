<template>
        <editor-content v-if="currentNote"  :editor="editor"/>
    <div v-else class="w-full">
        <div class="flex flex-col items-center gap-3  justify-center h-full">

         <span class="text-gray-500 text-4xl">
            Create your first note!
         </span>

          <button
              class="transition-all durartion-300 text-white rounded-full bg-green-500 outline-none hover:scale-125"
              @click="storeNote('',null)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                 class="w-16 h-16 p-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>

          </button>


        </div>

    </div>
</template>

<script setup>
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {watch, watchEffect} from 'vue';

const emit = defineEmits(['noteContent']);

import useNotes from '@/composables/useNotes';
const { currentNote, storeNote } = useNotes();


const editor = useEditor({
    extensions: [
        StarterKit,
        Placeholder.configure({
            // Use a placeholder:
            placeholder: 'Start typing',
        })
    ],
    editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose px-3 lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        }
    },
    onUpdate({editor}) {
        emit('noteContent', editor.getHTML());
        storeNote(editor.getHTML(), currentNote.value.date);
    },

    onCreate({editor}) {
        editor.commands.focus()
        editor.content = currentNote?.value?.note ?? '';
    },

    content: currentNote?.value?.note ?? '',
});

// Update the editor when the note changes.
watch(currentNote, (newVal) => {
    if (newVal?.note){
        editor.value.commands.setContent(newVal.note, false);
    } else {
        editor.value.commands.setContent('', false);
    }

    editor.value.commands.focus();
});


</script>

<style>
:root {
    --left-spacer: 6rem;
}


.ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;

}
.ProseMirror p.is-editor-empty:first-child{
  @apply h-screen
}

.ProseMirror *{
  @apply w-[calc(100vw_-_var(--left-spacer))] mx-auto
}
</style>