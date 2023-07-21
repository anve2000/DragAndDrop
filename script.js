const container = document.getElementsByClassName("container")[0];
const dropzones = document.getElementsByClassName("dropzone");
const numbox = document.getElementsByClassName("dropzone")[0];
const undo = document.getElementsByClassName("undo")[0];
const addButton = document.getElementsByClassName("add")[0];
const message = document.getElementsByClassName("message")[0];
const draggables = document.getElementsByClassName("draggable");
const body = document.getElementsByTagName("body")[0];

let stack = [];


let CellGap=20;
let boxHeight;
let boxWidth;

let cnt = 1;

let source = "";
let lastStateDropped = "",
  lastStateReplaced = "";


//arrays to store Color Codes already used :-
let xs = [],
  ys = [],
  zs = [];

const findCol = () => {
  var x = Math.floor(Math.random() * 256);
  while (xs.indexOf(x) != -1) {
    x = Math.floor(Math.random() * 256);
  }

  var y = Math.floor(Math.random() * 256);
  while (ys.indexOf(y) != -1) {
    y = Math.floor(Math.random() * 256);
  }

  var z = Math.floor(Math.random() * 256);
  while (zs.indexOf(z) != -1) {
    z = Math.floor(Math.random() * 256);
  }

  xs.push(x);
  ys.push(y);
  zs.push(z);

  var bgColor = "rgb(" + x + "," + y + "," + z + ")";
  return bgColor;
};

const createRow = () => {
  let newBoxArray = [];
  let newSpaceArray = [];

  for (let i = 0; i <= 2; i++) {
    let space = document.createElement("div");
    let box = document.createElement("div");
    space.classList.add("parent", "p", `_${cnt + i}`);
    box.classList.add("draggable", "dropzone", "c", `_${cnt + i}`);
    box.style.backgroundColor = findCol();
    box.innerText = `${(cnt + i) * 100}`;
    box.setAttribute("draggable", true);
    newBoxArray.push(box);
    newSpaceArray.push(space);
  }

  addToDraggables(newBoxArray);
  addToDropzones(newSpaceArray);

  for (let i = 0; i < newBoxArray.length; i++) {
    newSpaceArray[i].appendChild(newBoxArray[i]);
    container.appendChild(newSpaceArray[i]);
  }
  cnt+=3;
};

const createContainer = () => {
  for (let i = 1; i <= 3; i++) {
    createRow();
  }
  boxHeight = dropzones[0].clientHeight;
  boxWidth = dropzones[0].clientWidth;
};

createContainer();

function swap(source, destination) {
  let sourcePar = source.parentElement;
  let destPar = destination.parentElement;

  source.classList.add("moving");
  destination.classList.add("moving");

  destPar.removeChild(destination);
  sourcePar.removeChild(source);
  sourcePar.append(destination);
  destPar.append(source);

  setTimeout(function () {
    source.classList.remove("moving");
    destination.classList.remove("moving");
  }, 700);
}

function addToDraggables(draggables) {
  for (let i = 0; i < draggables.length; i++) {
    draggables[i].addEventListener("drag", (e) => {
      console.log("drag");
      e.target.classList.add("dragged");
    });

    draggables[i].addEventListener("dragstart", (e) => {
      source = e.target;
      lastStateDropped = "";
      lastStateReplaced = "";
    });

    draggables[i].addEventListener("dragover", (e) => {
      e.target.classList.add("dragover");
    });

    draggables[i].addEventListener("dragend", (e) => {
      e.target.classList.remove("dragged");
    });
  }
}


function addToDropzones(dropzones) {
  for (let i = 0; i < dropzones.length; i++) {
    dropzones[i].addEventListener("dragenter", (e) => {
      e.target.classList.add("dragenter");

      current = e.target;

      if (current.classList.contains("dropzone") === false) {
        return;
      }

      if (current === source) {
        return;
      }

      swap(source, current);
      let boxArr = document.querySelectorAll(".c");
      let array = Array.prototype.slice.call(boxArr);
      let sourceIndex = array.indexOf(source);
      let currentIndex = array.indexOf(current);
      stack.push({ sourceIndex, currentIndex });
    });

    dropzones[i].addEventListener("dragover", (e) => {
      e.preventDefault();
      e.target.classList.add("dragover");
    });

    dropzones[i].addEventListener("dragleave", (e) => {
      e.target.classList.remove("dragover", "dragenter");
      if (
        lastStateDropped === "" ||
        lastStateReplaced === "" ||
        lastStateDropped === lastStateReplaced
      )
        return;
      let val_1 = lastStateDropped.innerText;
      let val_2 = lastStateReplaced.innerText;
      message.innerText = `[${val_1}]  <--->   [${val_2}]`;
      message.style.opacity = 1;
      setTimeout(() => {
        message.style.opacity = 0;
      }, 700);
    });

    dropzones[i].addEventListener("drop", (e) => {
      e.target.classList.remove("dragover", "dragenter");
    });
  }
}

let current;

undo.addEventListener("click", (e) => {
  if (stack.length == 0) {
    message.innerText = "no box displaced yet....";
    message.style.opacity = 1;

    setTimeout(() => {
      message.innerText = "";
      message.style.opacity = 0;
    }, 700);

    return;
  }

  let top = stack[stack.length - 1];
  let boxArr = document.querySelectorAll(".c");
  let array = Array.prototype.slice.call(boxArr);

  let first = array[top.sourceIndex];
  let second = array[top.currentIndex];

  swap(first, second);
  stack.pop();

  let val_1 = second.innerText;
  let val_2 = first.innerText;
  message.innerText = `[${val_1}] <--->  [${val_2}]`;
  message.style.opacity = 1;

  setTimeout(() => {
    message.style.opacity = 0;
  }, 700);
});

addButton.addEventListener("click", () => {
  let totalLenNeeded =
    Math.ceil(Number(cnt / 3)) * boxHeight + boxHeight + 2 * CellGap;
  container.style.height = `${
    Math.ceil(Number(cnt / 3)) * boxHeight +
    Math.ceil(Number(cnt / 3)) * CellGap
  }px`;

  createRow();
});

