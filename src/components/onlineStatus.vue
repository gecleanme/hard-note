<template>
    <div v-if="clientOffline"
         class="offline-notice bg-red-500 opacity-80 text-center text-white w-1/4 h-[10%] z-10 absolute mb-2 flex items-center space-x-2 p-2">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="ml-2 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>


        <span>Unable to sync, looks like you are currently offline </span>


    </div>

    <div v-if="!clientOffline && showOnline"
         class="offline-notice bg-green-500 opacity-80 text-center text-white w-1/4 h-[10%] z-10 absolute mb-2 flex items-center space-x-2 p-2">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="ml-2 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>


        <span>Back online! </span>


    </div>

</template>

<script setup>

import {onlineStatus} from '@/composibles/useOnlineStatus.js';

const {clientOffline, showOnline} = onlineStatus();

</script>

<style scoped>

</style>