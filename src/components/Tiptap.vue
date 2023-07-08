<template>
    <editor-content :editor="editor"/>
</template>

<script setup>
import {useEditor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {watch} from 'vue';
import {watchEffect} from "vue";

const emit = defineEmits(['noteContent']);

const props = defineProps({
    shownNote: Object,
    clearNote: Boolean
})


const editor = useEditor({
    extensions: [
        StarterKit,
        Placeholder.configure({
            // Use a placeholder:
            placeholder: 'Type to create a note or choose from saved',
        })
    ],
    editorProps: {
        attributes: {
            class: 'overflow-y-auto break-all text-clip focus:outline-none w-full'
        }
    },
    onUpdate({editor}) {
        emit('noteContent', editor.getHTML());
    },

    onCreate({editor}) {
        editor.commands.focus()

    },

    content: "",
});


watch(() => props.shownNote, (newVal) => {
    if (newVal && newVal.note) {
        editor.value.commands.setContent(newVal.note);
    }

});


watch(()=> props.clearNote,(newVal) => {
    if (newVal) {
        editor.value.commands.clearContent();

    }
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