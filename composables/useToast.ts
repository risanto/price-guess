import { createApp } from "vue";
import ToastSuccess from "@/components/ToastSuccess.vue";

function showToast(message: string, type = "success") {
  if (!import.meta.client) return;

  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  // Create a new div to attach the Vue component
  const toastDiv = document.createElement("div");
  toastContainer.appendChild(toastDiv);

  // Create the Vue app with the ToastSuccess component
  const app = createApp(ToastSuccess, { message, type }); // Pass props if needed
  app.mount(toastDiv);

  setTimeout(() => {
    app.unmount(); // Unmount the Vue app
    toastDiv.remove();
  }, 10 * 1000); // Toast disappears after 3 seconds
}

export function useToast() {
  return { showToast };
}
