
import { sleep } from "./helpers/util.js";
import { SortingAlgorithms } from "./helpers/sortingAlgorithms.js";

let nBars = 10;
let numbersBars = document.getElementById('numbersBars');

const stage = document.getElementById('stage');
const stageWidth = 800; // Fixed stage width
stage.style.width = `${stageWidth}px`;

const selectAlgorithm = document.getElementById('selectAlgorithm');
const generateBtn = document.getElementById('generateBtn');
const solveBtn = document.getElementById('solveBtn');
const sortedMessage = document.createElement('div'); // Message after sorting
const statusMessage = document.getElementById('statusMessage'); // Reference to the status message container

sortedMessage.style.textAlign = "center";
sortedMessage.style.marginTop = "20px";

let bars = [];
let barsDivs = [];
let sorted = false;

const sortingAlgorithms = new SortingAlgorithms({});

const start = () => {
  stage.innerHTML = '';
  sortedMessage.innerHTML = ''; // Clear the message
  sorted = false;
  
  const barWidth = (stageWidth / nBars) - 5; // Dynamic bar width with 5px margin between bars

  bars = Array(nBars).fill(0).map(_ => {
    return {
      width: barWidth,
      height: Math.floor(Math.random() * 200) + 1
    };
  });

  barsDivs = [];

  for (let i = 0; i < bars.length; i++) {
    const bar = document.createElement('div');
    bar.style.width = `${bars[i].width}px`;
    bar.style.height = `${bars[i].height}px`;
    bar.style.left = `${i * (barWidth + 5)}px`;
    bars[i] = { ...bars[i], position: i };
    bar.classList.add('bar');

    const label = document.createElement('span');
    label.classList.add('bar-label');
    label.textContent = bars[i].height;
    bar.appendChild(label);

    barsDivs.push(bar);
    stage.appendChild(bar);
  }
};

start();

async function swapBars(barsDivs, i, j) {
  const barWidth = (stageWidth / nBars) - 5; 
  barsDivs[i].style.left = `${j * (barWidth + 5)}px`;
  barsDivs[i].classList.add('activate');
  barsDivs[j].style.left = `${i * (barWidth + 5)}px`;
  barsDivs[j].classList.add('activate');
  await sleep(300);
  barsDivs[i].classList.remove('activate');
  barsDivs[j].classList.remove('activate');
  let temp = barsDivs[i];
  barsDivs[i] = barsDivs[j];
  barsDivs[j] = temp;
}

const algorithms = [
  sortingAlgorithms.bubbleSort,
  sortingAlgorithms.selectionSort,
  sortingAlgorithms.quickSort
];

const solve = async () => {
  if (sorted) return; // Prevent solving again after sorting
  const array = structuredClone(bars.map(el => el.height));

  const swaps = algorithms[selectAlgorithm.selectedIndex](array);

  for (let i = 0; i < swaps.length; i++) {
    if (swaps[i].firstPostion !== swaps[i].lastPosition) {
      await swapBars(barsDivs, swaps[i].firstPostion, swaps[i].lastPosition);
    }
  }

  sorted = true;
  sortedMessage.innerHTML = 'Sorted! Now try a new array.';
  // button.parentElement.appendChild(sortedMessage); // Add the message below the stage
  statusMessage.innerHTML = ''; // Clear any previous messages
  statusMessage.appendChild(sortedMessage);
};

generateBtn.addEventListener('click', () => {
  nBars = parseInt(numbersBars.value, 10);
  start();
});

solveBtn.addEventListener('click', () => {
  solve();
});

