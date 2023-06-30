<template>
    <editor-content :editor="editor" />
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import {onMounted} from "vue";

const emit = defineEmits(['noteContent']);


const editor = useEditor({
    content: '<p>Start Typing Here...</p>',
    extensions: [
        StarterKit,
    ],
    editorProps:{
        attributes: {
            class: 'overflow-auto focus:outline-none'
        }
    }
})
onMounted(()=>{
    setInterval(()=>{
        emit('noteContent', editor.value.getHTML());
    }, 1000);

})
</script>