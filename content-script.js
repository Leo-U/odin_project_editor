// Flag to track if the current content is the original
let isOriginalContent = false;

// Function to toggle edit mode
function toggleEditMode() {
  const content = document.querySelector('.lesson-content');
  if (content) {
    const isEditable = content.isContentEditable;
    content.contentEditable = !isEditable;
    // Save the original content when first entering edit mode
    if (!isEditable) {
      const url = window.location.href;
      browser.storage.local.get('originalContent', function(result) {
        if (!result.originalContent) {
          browser.storage.local.set({ originalContent: content.innerHTML });
        }
      });
    }
  }
}

// Function to save the edited content
function saveEditedContent() {
  const content = document.querySelector('.lesson-content');
  if (content && content.isContentEditable) {
    const editedContent = content.innerHTML;
    const url = window.location.href;
    browser.storage.local.set({[url]: editedContent}, () => {
      console.log('Content saved for URL:', url);
    });
  }
}

// Function to load saved content
function loadSavedContent() {
  const url = window.location.href;
  browser.storage.local.get(url, function(result) {
    if (result[url]) {
      const content = document.querySelector('.lesson-content');
      if (content) {
        content.innerHTML = result[url];
        isOriginalContent = false;
      }
    }
  });
}

// Function to toggle between the original and edited content
function toggleContentVersion() {
  const content = document.querySelector('.lesson-content');
  if (content) {
    const url = window.location.href;

    if (isOriginalContent) {
      // Switch to edited content
      browser.storage.local.get(url, function(result) {
        if (result[url]) {
          content.innerHTML = result[url];
          isOriginalContent = false;
        }
      });
    } else {
      // Switch to original content
      browser.storage.local.get('originalContent', function(result) {
        if (result.originalContent) {
          content.innerHTML = result.originalContent;
          isOriginalContent = true;
        }
      });
    }
  }
}

// Listener for messages from popup.js
browser.runtime.onMessage.addListener(request => {
  if (request.action === "toggleEditMode") {
    toggleEditMode();
  } else if (request.action === "saveContent") {
    saveEditedContent();
  } else if (request.action === "loadSavedContent") {
    loadSavedContent();
  } else if (request.action === "toggleContentVersion") {
    toggleContentVersion();
  }
});

// On page load, try to load saved content
loadSavedContent();
