new Image().src = "./img/vanguard-bg.jpg";
new Image().src = "./img/coldwar-bg.jpg";

function setBackground(src) {
  document.getElementById(
    "wrapper"
  ).style.backgroundImage = `url(./img/${src})`;
  console.log(document.getElementById("wrapper"));
}

setBackground("vanguard-bg.jpg");
const classList = document.getElementById("item-vanguard").classList;

document.getElementById("item-coldwar").addEventListener(
  "mouseover",
  function () {
    if (classList.contains("active")) {
      classList.remove("active");
    }
    setBackground("coldwar-bg.jpg");
  },
  false
);

document.getElementById("item-vanguard").addEventListener(
  "mouseover",
  function () {
    if (classList.contains("active")) {
      classList.remove("active");
    }
    setBackground("vanguard-bg.jpg");
  },
  false
);
