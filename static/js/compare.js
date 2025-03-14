function selectCompImage(element) {
  element.parentElement.getElementsByClassName("is-selected")[0].classList.remove("is-success", "is-selected");
  element.classList.add("is-success", "is-selected");

  let parent = element.parentElement.parentElement;
  let imageId1 = parent.getAttribute("id") + "-image1";
  let imageId2 = parent.getAttribute("id") + "-image2";
  let canvasId = parent.getAttribute("id") + "-canvas";
  let methodName = parent.getElementsByClassName("method-buttons")[0].getElementsByClassName("is-selected")[0].getAttribute("value");
  let sceneName = parent.getElementsByClassName("scene-buttons").length == 0 ? "omni3d_dinosaur_006" : parent.getElementsByClassName("scene-buttons")[0].getElementsByClassName("is-selected")[0].getAttribute("value");

  let image1 = document.getElementById(imageId1);
  let image2 = document.getElementById(imageId2);
  // let canvas = document.getElementById(canvasId);

  // canvas.replaceWith(canvas.cloneNode(true));

  image1.src = "static/images/comparison/" + sceneName + "/DAI.png";
  image2.src = "static/images/comparison/" + sceneName + '/' + methodName + ".png";
  // image.src = "static/images/megumi6.png";
  image2.onload = () => {
    // resizeAndDisplay(image);
    compareImages(imageId1, imageId2, canvasId);
  };
}

function compareImages(image1Id, image2Id, canvasId, ratio = 0.5) {
  console.log("Comparing images:", image1Id, image2Id, canvasId);
  let image1 = document.getElementById(image1Id);
  let image2 = document.getElementById(image2Id);
  let canvas = document.getElementById(canvasId);

  let ctx = canvas.getContext("2d");

  // 启用高质量插值
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 使用屏幕比例来设置固定高度
  let fixedHeight = window.innerHeight * ratio; // 例如，使用屏幕高度的50%
  let aspectRatio = image1.width / image1.height;
  let fixedWidth = fixedHeight * aspectRatio;

  // 设置 canvas 的尺寸
  canvas.width = fixedWidth;
  canvas.height = fixedHeight;

  let position = 0.5; // 初始分割线位置在中间

  // 监听鼠标移动事件
  canvas.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    position = (e.clientX - rect.left) / rect.width;
    drawImages();
  });

  // 监听触摸事件
  canvas.addEventListener("touchmove", (e) => {
    let rect = canvas.getBoundingClientRect();
    position = (e.touches[0].clientX - rect.left) / rect.width;
    drawImages();
  });

  function drawImages() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制第一张图片
    ctx.drawImage(image1, 0, 0, fixedWidth, fixedHeight);

    // 绘制第二张图片的部分
    let splitPoint = fixedWidth * position;
    ctx.drawImage(image2, image2.width * position, 0, image2.width * (1 - position), image2.height, splitPoint, 0, fixedWidth - splitPoint, fixedHeight);

    // 绘制分割线
    ctx.beginPath();
    ctx.moveTo(splitPoint, 0);
    ctx.lineTo(splitPoint, fixedHeight);
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 5;
    ctx.stroke();

    // 绘制箭头
    drawArrow(ctx, splitPoint, fixedHeight / 2);
  }

  function drawArrow(ctx, x, y) {
    let arrowLength = 0.09 * fixedHeight;
    let arrowheadWidth = 0.025 * fixedHeight;
    let arrowheadLength = 0.04 * fixedHeight;
    let arrowWidth = 0.007 * fixedHeight;

    // 绘制箭头背景圆
    ctx.beginPath();
    ctx.arc(x, y, arrowLength * 0.7, 0, Math.PI * 2, false);
    ctx.fillStyle = "#FFD79340";
    ctx.fill();

    // 绘制左箭头
    ctx.beginPath();
    ctx.moveTo(x - arrowLength / 2, y - arrowWidth / 2);
    ctx.lineTo(x - arrowheadLength / 2, y - arrowWidth / 2);
    ctx.lineTo(x - arrowheadLength / 2, y - arrowheadWidth / 2);
    ctx.lineTo(x, y);
    ctx.lineTo(x - arrowheadLength / 2, y + arrowheadWidth / 2);
    ctx.lineTo(x - arrowheadLength / 2, y + arrowWidth / 2);
    ctx.lineTo(x - arrowLength / 2, y + arrowWidth / 2);
    ctx.closePath();
    ctx.fillStyle = "#444444";
    ctx.fill();

    // 绘制右箭头
    ctx.beginPath();
    ctx.moveTo(x + arrowLength / 2, y - arrowWidth / 2);
    ctx.lineTo(x + arrowheadLength / 2, y - arrowWidth / 2);
    ctx.lineTo(x + arrowheadLength / 2, y - arrowheadWidth / 2);
    ctx.lineTo(x, y);
    ctx.lineTo(x + arrowheadLength / 2, y + arrowheadWidth / 2);
    ctx.lineTo(x + arrowheadLength / 2, y + arrowWidth / 2);
    ctx.lineTo(x + arrowLength / 2, y + arrowWidth / 2);
    ctx.closePath();
    ctx.fillStyle = "#444444";
    ctx.fill();
  }

  // 初始绘制
  drawImages();
}


function displayImages(imageId) {
  let canvas = document.getElementById(imageId.replace('image', 'canvas'));
  let image = document.getElementById(imageId);

  let position = 0.5;
  let imgWidth = image.width / 2;
  let imgHeight = image.height;

  let mergeContext = canvas.getContext("2d");

  function trackLocation(e) {
    let bcr = canvas.getBoundingClientRect();
    position = (e.pageX - bcr.x) / bcr.width;
  }
  function trackLocationTouch(e) {
    let bcr = canvas.getBoundingClientRect();
    position = (e.touches[0].pageX - bcr.x) / bcr.width;
  }

  canvas.addEventListener("mousemove", trackLocation, false);
  canvas.addEventListener("touchstart", trackLocationTouch, false);
  canvas.addEventListener("touchmove", trackLocationTouch, false);

  function drawLoop() {
    mergeContext.drawImage(image, 0, 0, imgWidth, imgHeight, 0, 0, imgWidth, imgHeight);
    let colStart = (imgWidth * position).clamp(0.0, imgWidth);
    let colWidth = (imgWidth - imgWidth * position).clamp(0.0, imgWidth);
    mergeContext.drawImage(image, colStart + imgWidth, 0, colWidth, imgHeight, colStart, 0, colWidth, imgHeight);
    requestAnimationFrame(drawLoop);

    let arrowLength = 0.09 * imgHeight;
    let arrowheadWidth = 0.025 * imgHeight;
    let arrowheadLength = 0.04 * imgHeight;
    let arrowPosY = imgHeight / 10;
    let arrowWidth = 0.007 * imgHeight;
    let currX = imgWidth * position;

    mergeContext.arc(currX, arrowPosY, arrowLength * 0.7, 0, Math.PI * 2, false);
    mergeContext.fillStyle = "#FFD79340";
    mergeContext.fill();

    mergeContext.beginPath();
    mergeContext.moveTo(imgWidth * position, 0);
    mergeContext.lineTo(imgWidth * position, imgHeight);
    mergeContext.closePath();
    mergeContext.strokeStyle = "#444444";
    mergeContext.lineWidth = 5;
    mergeContext.stroke();

    mergeContext.beginPath();
    mergeContext.moveTo(currX, arrowPosY - arrowWidth / 2);
    mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY - arrowWidth / 2);
    mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY - arrowheadWidth / 2);
    mergeContext.lineTo(currX + arrowLength / 2, arrowPosY);
    mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY + arrowheadWidth / 2);
    mergeContext.lineTo(currX + arrowLength / 2 - arrowheadLength / 2, arrowPosY + arrowWidth / 2);
    mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY + arrowWidth / 2);
    mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY + arrowheadWidth / 2);
    mergeContext.lineTo(currX - arrowLength / 2, arrowPosY);
    mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY - arrowheadWidth / 2);
    mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY);
    mergeContext.lineTo(currX - arrowLength / 2 + arrowheadLength / 2, arrowPosY - arrowWidth / 2);
    mergeContext.lineTo(currX, arrowPosY - arrowWidth / 2);
    mergeContext.closePath();
    mergeContext.fillStyle = "#444444";
    mergeContext.fill();
  }
  requestAnimationFrame(drawLoop);
}

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

function resizeAndDisplay(element) {
  let canvas = document.getElementById(element.id.replace('image', 'canvas'));
  canvas.width = element.width / 2;
  canvas.height = element.height;
  displayImages(element.id);
}
