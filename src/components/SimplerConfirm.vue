<template>
  <div v-if="isOpen" :class="containerClasses">
    <div :class="overlayClasses">
      <div :class="dialogClasses">
        <div :class="titleClasses">{{ title }}</div>
        <div :class="messageClasses">{{ message }}</div>
        <div :class="buttonContainerClasses">
          <button :class="yesClasses" @click="confirm">{{ yesText }}</button>
          <button :class="noClasses" @click="close">{{ noText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  onConfirm: Function,
  onClose: Function,
  yesText: String,
  noText: String,
  containerClasses: {
    type: String,
    default: "sc-container",
  },

  overlayClasses: {
    type: String,
    default: "sc-overlay",
  },

  dialogClasses: {
    type: String,
    default: "sc-dialog",
  },

  buttonContainerClasses: {
    type: String,
    default: "sc-btn-container",
  },

  titleClasses: {
    type: String,
    default: "sc-title",
  },

  messageClasses: {
    type: String,
    default: "sc-msg",
  },

  yesClasses: {
    type: String,
    default: "sc-yes",
  },

  noClasses: {
    type: String,
    default: "sc-no",
  },
});

const close = () => {
  props.onClose();
};

const confirm = () => {
  props.onConfirm();
};
</script>

<style scoped>
.sc-container {
}

.sc-overlay {
  @apply fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50;
}

.sc-dialog {
  @apply max-w-md mx-auto bg-white rounded-lg shadow-lg p-6;
}

.sc-title {
  @apply text-lg font-bold mb-2;
}

.sc-msg {
  @apply text-center text-gray-700 mb-4;
}

.sc-btn-container {
  @apply flex justify-center mt-4;
}

.sc-yes {
  @apply bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded shadow mx-6;
}

.sc-no {
  @apply bg-white hover:bg-gray-100 hover:cursor-pointer text-gray-700 font-bold py-2 px-4 border border-gray-400 rounded shadow mr-2;
}
</style>
