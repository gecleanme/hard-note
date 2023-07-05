<template>
    <transition name="fade">
        <div v-if="visible" class="binkr-flash-message" :class="type">
            {{ message }}
        </div>
    </transition>
</template>

<script setup>
import {ref, watchEffect} from 'vue'

const props = defineProps({
    message: String,
    type: {
        type: String,
        default: 'info'
    },
    duration: {
        type: Number,
        default: 3000
    }
})

const visible = ref(false)

watchEffect(() => {
    visible.value = true
    setTimeout(() => {
        visible.value = false
    }, props.duration)
})
</script>

<style scoped>
.binkr-flash-message {
    @apply p-4 rounded mb-4 text-center fixed top-4 right-4 z-50;
}

.fade-enter-active,
.fade-leave-active {
    @apply transition-opacity duration-500;
}

.fade-enter,
.fade-leave-to {
    @apply opacity-0;
}

.binkr-flash-message {
    @apply rounded-lg p-4;
}

.binkr-flash-message.info {
    @apply bg-blue-100 text-blue-700;
}

.binkr-flash-message.success {
    @apply bg-green-100 text-green-700;
}

.binkr-flash-message.warning {
    @apply bg-yellow-100 text-yellow-700;
}

.binkr-flash-message.error {
    @apply bg-red-100 text-red-700;
}

</style>