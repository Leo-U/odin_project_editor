// Function to toggle edit mode
function toggleEditMode() {
  const content = document.querySelector('.lesson-content'); // Replace '.lesson-content' with the actual selector of the content you want to edit
  if (content) {
    content.contentEditable = !content.isContentEditable;
    // If we are enabling edit mode, save the current (original) content
    if (content.isContentEditable) {
      const originalContent = content.innerHTML;
      browser.storage.local.set({ originalContent: originalContent });
    }
  }
}

// Function to load saved content
function loadSavedContent() {
  const url = window.location.href;
  // Retrieve the saved content from local storage
  browser.storage.local.get([url], function(result) {
    if (result[url]) {
      const content = document.querySelector('.lesson-content'); // Replace '.lesson-content' with the actual selector of the content you want to edit
      if (content) {
        content.innerHTML = result[url];
      }
    }
  });
}

// Listener for messages from popup.js
browser.runtime.onMessage.addListener(request => {
  if (request.action === "toggleEditMode") {
    toggleEditMode();
  } else if (request.action === "loadSavedContent") {
    loadSavedContent();
  }
});

// On page load, try to load saved content
loadSavedContent();
