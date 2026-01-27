chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== "offscreen") return;

  if (message.type === "get-geolocation") {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendResponse({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        sendResponse({ error: err.message });
      },
    );
    return true;
  }
});
