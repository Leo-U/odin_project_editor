// Global variable to keep track of the original content
let isOriginalContent = false;
let isEditModeActive = false; // Track whether edit mode is active

// Function to toggle edit mode
function toggleEditMode() {
  const content = document.querySelector('.lesson-content');
  if (content) {
    const isEditable = content.isContentEditable;
    content.contentEditable = !isEditable;
    isEditModeActive = !isEditable; // Update the edit mode status

    if (!isEditable) {
      const url = window.location.href;
      browser.storage.local.get('originalContent', function(result) {
        if (!result.originalContent) {
          browser.storage.local.set({ originalContent: content.innerHTML });
        }
      });
      // Focus on the content and apply styling to indicate it's editable
      content.focus();
      content.style.border = '1px solid blue'; // Example style, adjust as needed
      content.style.outline = 'none'; // Remove outline on focus
    } else {
      // Remove edit styling when toggling off
      content.style.border = '';
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

// Function to load saved content based on last toggled state
function loadSavedContent() {
  const url = window.location.href;
  browser.storage.local.get(['lastToggledToOriginal', url, 'originalContent'], function(result) {
    if (result.lastToggledToOriginal && result.originalContent) {
      const content = document.querySelector('.lesson-content');
      if (content) {
        content.innerHTML = result.originalContent;
        isOriginalContent = true;
      }
    } else if (result[url]) {
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
          browser.storage.local.remove('lastToggledToOriginal');
        }
      });
    } else {
      // Switch to original content
      browser.storage.local.get('originalContent', function(result) {
        if (result.originalContent) {
          content.innerHTML = result.originalContent;
          isOriginalContent = true;
          browser.storage.local.set({ lastToggledToOriginal: true });
        }
      });
    }
  }
}

// Function to handle keydown events for shortcuts
function handleKeyDown(e) {
  // Check for Ctrl + F1 key combination to toggle edit mode
  if (e.ctrlKey && e.key === 'F1') {
    toggleEditMode();
  }
  // Check for Ctrl + F2 key combination to save
  else if (e.ctrlKey && e.key === 'F2') {
    saveEditedContent();
  }
  // Check for Ctrl + F3 key combination to toggle content version
  else if (e.ctrlKey && e.key === 'F3') {
    toggleContentVersion();
  }
  // Check for Escape key to exit edit mode
  else if (e.key === 'Escape' && isEditModeActive) {
    toggleEditMode();
  }
}

// Attach the keydown event listener to the document
document.addEventListener('keydown', handleKeyDown);

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
