document.getElementById('toggle-edit').addEventListener('click', () => {
  browser.tabs.query({active: true, currentWindow: true}, tabs => {
    browser.tabs.sendMessage(tabs[0].id, {action: "toggleEditMode"});
  });
  window.close(); // Close the popup
});

document.getElementById('save-content').addEventListener('click', () => {
  browser.tabs.query({active: true, currentWindow: true}, tabs => {
    browser.tabs.sendMessage(tabs[0].id, {action: "saveContent"});
  });
});

document.getElementById('toggle-version').addEventListener('click', () => {
  browser.tabs.query({active: true, currentWindow: true}, tabs => {
    browser.tabs.sendMessage(tabs[0].id, {action: "toggleContentVersion"});
  });
});
