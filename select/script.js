new Image().src = "img/vanguard-bg.jpg";
new Image().src = "img/coldwar-bg.jpg";

function setBackground(src) {
  document.getElementById("wrapper").style.backgroundImage = `url(img/${src})`;
}

setBackground("vanguard-bg.jpg");

document.getElementById("item-coldwar").addEventListener(
  "mouseover",
  function () {
    setBackground("coldwar-bg.jpg");
  },
  false
);

document.getElementById("item-vanguard").addEventListener(
  "mouseover",
  function () {
    setBackground("vanguard-bg.jpg");
  },
  false
);
