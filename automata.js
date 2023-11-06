const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const neighbors = 3
const colorChoices = ["white", "black", "grey", "red", "green", "blue"]
const EMPTY = "0"
let isPlaying = false
let playDelay = 500;

rules = new Map();

function getRule(ruleNum, numColors) {
    const numberOfInputs = numColors ** neighbors;
    if (!rules.has(ruleNum)) {
        rules.set(ruleNum, ruleNum.toString(numColors).padStart(numberOfInputs, EMPTY));
    }

    return rules.get(ruleNum);
}

function evaluate(ruleNum, pattern, numColors) {
    const rule = getRule(ruleNum, numColors);
    const maxIndex = rule.length - 1;
    return rule[maxIndex - parseInt(pattern, numColors)];
}

function renderRow(row, columnNum, cellSize) {
    for(let i = 0; i < row.length; ++i) {
        if (row[i] !== EMPTY) {
            ctx.fillStyle = colorChoices[Number(row[i])];
            ctx.fillRect(cellSize * i, columnNum * cellSize, cellSize, cellSize);
        }
    }
}

function renderRule(ruleNum, initialRow, depth, cellSize, numColors) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let row = initialRow;
    for (let level = 0; level < depth; ++level) {
        renderRow(row, level, cellSize);
        let nextRow = EMPTY 
        for (let i = 0; i < row.length - neighbors + 1; ++i) {
            const pattern = row.slice(i, i + neighbors)
            nextRow += evaluate(ruleNum, pattern, numColors)
        }
        nextRow += EMPTY;
        row = nextRow
    }
}

function fitCanvasToWindow() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

const form = document.getElementById("form");
const ruleInput = document.getElementById("rule");
const initialStateInput = document.getElementById("initialState");
const gridHeightInput = document.getElementById("gridHeight");
const cellSizeInput = document.getElementById("cellSize");
const numColorsInput = document.getElementById("numColors");

const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");


pauseButton.addEventListener("click", () => {
    isPlaying = false;
})

playButton.addEventListener("click", () => {
    isPlaying = true;
})

fitCanvasToWindow();

form.addEventListener("submit", event => {
    // don't refresh the page
    event.preventDefault();

    const ruleNumber = parseInt(ruleInput.value);
    const initialState = initialStateInput.value;
    const gridHeight = parseInt(gridHeightInput.value);
    const cellSize = parseInt(cellSizeInput.value);
    const numColors = parseInt(numColorsInput.value);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("rule", ruleNumber);
    searchParams.set("initialState", initialState);
    searchParams.set("height", gridHeight);
    searchParams.set("cellSize", cellSize);
    searchParams.set("numColors", numColors);
    searchParams.set("isPlaying", isPlaying ? "1" : "0");
    window.location.search = searchParams.toString();
})

function updateRule(newRule) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("rule", newRule);
    window.location.search = searchParams.toString();
}

ruleInput.addEventListener("change", event => {
    updateRule(event.target.value)
})



const searchParams = new URLSearchParams(window.location.search);
const ruleNumber = searchParams.get("rule");
const initialState = searchParams.get("initialState");
const gridHeight = searchParams.get("height");
const cellSize = searchParams.get("cellSize");
const numColors = searchParams.get("numColors");
const isPlayingParam = searchParams.get("isPlaying");
const playDelayParam = searchParams.get("playDelay");

if (ruleNumber) {
    ruleInput.value = ruleNumber;
}

if (initialState) {
    initialStateInput.value = initialState;
}

if (gridHeight) {
    gridHeightInput.value = gridHeight;
}

if (cellSize) {
    cellSizeInput.value = cellSize;
}

if (numColors) {
    numColorsInput.value = numColors
}

if (isPlayingParam) {
    isPlaying = isPlayingParam === "1" ? true : false
}

if (playDelayParam) {
    playDelay = parseInt(playDelayParam)
}

if (isPlaying) {
    setTimeout(() => {
        if (isPlaying) {
            updateRule(parseInt(ruleInput.value) + 1)
        }
    }, playDelay)
}


const numColorsInputValue = parseInt(numColorsInput.value);
ruleInput.setAttribute("max", numColorsInputValue ** (numColorsInputValue ** neighbors) - 1)

renderRule(parseInt(ruleNumber), initialState, parseInt(gridHeight), parseInt(cellSize), parseInt(numColors));