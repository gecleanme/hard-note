<template>
    <editor-content :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {onMounted} from "vue";

const emit = defineEmits(['noteContent']);

const props = defineProps({
    shownNote: Object
})


import { watch } from 'vue';


let editor;

editor = useEditor({
    extensions: [
        StarterKit,
    ],
    editorProps: {
        attributes: {
            class: 'overflow-auto focus:outline-none'
        }
    },

    // content: props.shownNote.note ?props.shownNote.note : '<p>Start Typing</p>',
    content: '<p>Start Typing</p>'
});

onMounted(()=>{
    // watch(props.shownNote, (newVal) => {
    //     if (newVal && newVal.note) {
    //         editor.commands.setContent(newVal.note);
    //     } else {
    //         editor.commands.setContent ('<p>Start Typing</p>');
    //     }
    // }, { immediate: true });

    // the whole thing is busted but this is my wip code
    // i will leave the keyboard / mouse now

    // setInterval(() => {
    //     emit('noteContent', editor.value.getHTML());
    // }, 1000);

})


</script>