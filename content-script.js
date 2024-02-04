// Function to toggle edit mode
function toggleEditMode() {
  const content = document.querySelector('.lesson-content'); // Replace '.lesson-content' with the actual selector of the content you want to edit
  if (content) {
    content.contentEditable = !content.isContentEditable;
  }
}

// Listener for messages from popup.js
browser.runtime.onMessage.addListener(request => {
  if (request.action === "toggleEditMode") {
    toggleEditMode();
  }
});

// You can include other functions or code needed for your extension here
