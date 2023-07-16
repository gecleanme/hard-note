<template>
    <div v-if="currentNote">
        <editor-content :editor="editor"/>
    </div>
    <div v-else>
        <h1 class="py-8">No Notes</h1>
        <p class="py-8 text-base">Click the + button to add one</p>

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
            class: 'overflow-y-auto break-all text-clip focus:outline-none w-full'
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
.ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}
</style>