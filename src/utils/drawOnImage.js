export function drawOnImage(canvasTarget = "canvasEditor", image = null) {
  const canvasElement = document.getElementById(canvasTarget);
  if (!canvasElement) return;

  const context = canvasElement.getContext("2d");
  let tool = "pencil";
  let startX, startY;

  if (image) {
    const imageWidth = image.width;
    const imageHeight = image.height;
    const desiredHeight = image.height > 633 ? 633 : image.height;
    const aspectRatio = imageWidth / imageHeight;
    const desiredWidth = Math.round(desiredHeight * aspectRatio);
    canvasElement.width = desiredWidth;
    canvasElement.height = desiredHeight;

    context.drawImage(image, 0, 0, desiredWidth, desiredHeight);
  }

  document
    .getElementById("pencilButton")
    .addEventListener("click", () => (tool = "pencil"));
  document
    .getElementById("rectangleButton")
    .addEventListener("click", () => (tool = "rectangle"));
  document
    .getElementById("textButton")
    .addEventListener("click", () => (tool = "text"));

  let isDrawing = false;

  function getMousePosition(event) {
    const rect = canvasElement.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvasElement.width / rect.width),
      y: (event.clientY - rect.top) * (canvasElement.height / rect.height),
    };
  }

  canvasElement.onmousedown = (e) => {
    isDrawing = true;
    const { x, y } = getMousePosition(e);
    startX = x;
    startY = y;
    if (tool === "text") {
      const text = prompt("Enter text:", "");
      if (text) {
        context.fillText(text, x, y);
      }
      isDrawing = false; // Stop drawing after text input
    } else {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y);
      context.stroke();
    }
  };

  canvasElement.onmousemove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getMousePosition(e);
    if (tool === "pencil") {
      context.lineTo(x, y);
      context.stroke();
    } else if (tool === "rectangle" && isDrawing) {
      // TODO: rectangle indication
    }
  };

  canvasElement.onmouseup = function (e) {
    if (tool === "rectangle" && isDrawing) {
      const { x, y } = getMousePosition(e);
      context.strokeRect(startX, startY, x - startX, y - startY);
    }

    isDrawing = false;
    context.closePath();
  };

  context.lineWidth = 2;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.font = "16px Arial";
  context.strokeStyle = "red";
  context.fillStyle = "red";
}
