// SETTINGS
var radius = 250;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 175;
var imgHeight = 250;

var bgMusicURL = null; // add music link if needed
var bgMusicControls = true;

// START AFTER 1s
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid];

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform =
      "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay =
      delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;
  obj.style.transform =
    "rotateX(" + (-tY) + "deg) rotateY(" + tX + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? 'running' : 'paused';
}

var sX, sY, nX, nY;
var desX = 0, desY = 0;
var tX = 0, tY = 10;

// AUTO ROTATE
if (autoRotate) {
  var animationName = rotateSpeed > 0 ? 'spin' : 'spinRevert';
  ospin.style.animation =
    `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// BACKGROUND MUSIC
if (bgMusicURL) {
  document.getElementById('music-container').innerHTML += `
    <audio src="${bgMusicURL}" ${bgMusicControls ? 'controls' : ''} autoplay loop></audio>
  `;
}

// DRAG ROTATION
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  sX = e.clientX;
  sY = e.clientY;

  this.onpointermove = function (e) {
    nX = e.clientX;
    nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function () {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);

      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);

    this.onpointermove = null;
    this.onpointerup = null;
  };

  return false;
};

// MOUSE WHEEL ZOOM
document.onmousewheel = function(e) {
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};