import { ref } from "vue";

export function onlineStatus() {
  const clientOffline = ref(!navigator.onLine);
  const showOnline = ref(false);
  window.addEventListener("online", () => {
    clientOffline.value = false;
    showOnline.value = true;
    setTimeout(() => {
      showOnline.value = false;
    }, 4000);
  });

  window.addEventListener("offline", () => {
    clientOffline.value = true;
  });

  return { clientOffline, showOnline };
}
