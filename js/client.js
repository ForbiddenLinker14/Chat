document.addEventListener("DOMContentLoaded", () => {
  const socket = io.connect();
  const messageInput = document.getElementById("message-input");
  const sendMessageButton = document.querySelector(".send-message-button");
  const conversationBoard = document.getElementById("conversation-board");

  // Prompt for username
  const username = prompt("Enter your username:");

  sendMessageButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message !== "") {
      sendMessage({ text: message, username: username });
      messageInput.value = "";
    }
  });

  socket.on("message", (data) => {
    receiveMessage(data);
  });

  function sendMessage(message) {
    socket.emit("message", message);
  }

  function createMessageContainer(data, modifier = "") {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add(
      "chat__conversation-board__message-container",
      modifier
    );

    messageContainer.innerHTML = `
    <div class="chat__conversation-board__message__person">
      <div class="chat__conversation-board__message__person__avatar">
        <img src="https://randomuser.me/api/portraits/${
          data.username === username ? "men" : "women"
        }/9.jpg" alt="${data.username}" />
      </div>
      <span class="chat__conversation-board__message__person__nickname">${
        data.username
      }</span>
    </div>
    <div class="chat__conversation-board__message__context">
      <div class="chat__conversation-board__message__bubble">
        <span>${data.text}</span>
      </div>
    </div>
  `;

    return messageContainer;
  }

  function receiveMessage(data) {
    const messageContainer = createMessageContainer(data);
    conversationBoard.appendChild(messageContainer);
    conversationBoard.scrollTop = conversationBoard.scrollHeight;
  }

  function sendingMessage(data) {
    const messageContainer = createMessageContainer(data, "reversed");
    conversationBoard.appendChild(messageContainer);
    conversationBoard.scrollTop = conversationBoard.scrollHeight;
  }
});
