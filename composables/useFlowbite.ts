export function useFlowbite(callback: any) {
  if (import.meta.client) {
    import("flowbite").then((flowbite) => {
      callback(flowbite);
    });
  }
}
