<template>
  <Blinkr message="Success" type="success" v-if="showSuccess"></Blinkr>

  <Blinkr message="Saving..." type="info" v-if="saveSuccess"></Blinkr>

  <div class="flex w-screen h-screen overflow-y-hidden">
    <div
      class="py-4 border-r-2 border-gray-300 bg-gray-200 flex flex-col flex-shrink-0 md:w-1/4"
      :class="{
        'w-[42%]': sidebarShown,
        'md:w-1/4': sidebarShown,
        hidden: !sidebarShown,
      }"
    >
      <Sidebar />
    </div>

    <OnlineStatus></OnlineStatus>

    <article
      class="ml-4 prose lg:prose-xl w-3/4 flex overflow-y-auto text-clip break-all"
    >
      <Tiptap />
      <div class="flex-grow"></div>
      <div class="btns flex space-x-4">
        <!-- New Note -->
        <button
          class="absolute bottom-9 right-2 text-white rounded-full bg-green-500 outline-none hover:scale-110"
          @click="storeNote('', null)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-16 h-16 p-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>

        <!-- toggle sidebar -->
        <button
          class="absolute top-2 right-2 text-white rounded-full bg-blue-500 outline-none hover:scale-110"
          @click="sidebarShown = !sidebarShown"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-16 h-16 p-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <button
          v-if="currentNote"
          @click="showConfirmDialog"
          class="absolute bottom-9 right-24 text-white rounded-full bg-red-500 outline-none hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-16 h-16 p-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>

      <div class="z-20 text-gray-400 p-2 absolute bottom-0 right-0 text-sm">
        Notes are Auto-saved
      </div>
    </article>
  </div>

  <SimplerConfirm
    :isOpen="isDialogOpen"
    title="Really Delete?"
    message="Once done, there's no going back!"
    :onConfirm="deleteAction"
    :onClose="handleCancel"
    yesText="Shred away!"
    noText="Keep Note"
  />
</template>

<script setup>
import Tiptap from "@/components/Tiptap.vue";
import { ref } from "vue";
import Blinkr from "@/components/Blinkr.vue";
import OnlineStatus from "@/components/onlineStatus.vue";
import Sidebar from "@/components/Sidebar.vue";
import SimplerConfirm from "@/components/SimplerConfirm.vue";
import useNotes from "@/composables/useNotes";

const { deleteNote, currentNote, showSuccess, saveSuccess, storeNote } =
  useNotes();

const isDialogOpen = ref(false);
const sidebarShown = ref(false);

const showConfirmDialog = () => {
  isDialogOpen.value = true;
};

const handleCancel = () => {
  isDialogOpen.value = false;
};

const deleteAction = async () => {
  await deleteNote(currentNote);
  isDialogOpen.value = false;
};
</script>
