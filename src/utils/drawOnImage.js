export function drawOnImage(canvasTarget = "canvasEditor", image = null) {
  const canvasElement = document.getElementById(canvasTarget);
  canvasElement.style.backgroundColor = "red";
  if (!canvasElement) return;
  const context = canvasElement.getContext("2d");

  // if an image is present,
  // the image passed as parameter is drawn in the canvas
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
    // Adjust coordinates relative to the canvas and dialog position
    const { x, y } = getMousePosition(e);
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.lineJoin = "round";
    context.lineCap = "round";
    context.moveTo(x, y);
  };

  canvasElement.onmousemove = (e) => {
    if (isDrawing) {
      const { x, y } = getMousePosition(e);

      context.lineTo(x, y);
      context.stroke();
    }
  };

  canvasElement.onmouseup = function () {
    isDrawing = false;
    context.closePath();
  };
}
