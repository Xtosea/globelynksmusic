document.addEventListener("DOMContentLoaded", () => {
  let deferredPrompt;
  const installBtn = document.getElementById("installBtn");

  if (!installBtn) {
    console.log("Install button not found");
    return;
  }

  // Listen for install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "block";
  });

  // Handle click
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("User installed the app");
    } else {
      console.log("User dismissed install");
    }

    deferredPrompt = null;
    installBtn.style.display = "none";
  });

  // After install
  window.addEventListener("appinstalled", () => {
    console.log("App installed");
    installBtn.style.display = "none";
  });
});