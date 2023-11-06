const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const neighbors = 3
const colors = 2
const EMPTY = "0"
const FILLED = "1"
const FILLED_COLOR = "black"
const numberOfInputs = colors ** neighbors;
const maxIndex = numberOfInputs - 1;

function generateRules() {
    const numberOfRules = colors ** numberOfInputs;
    return [...Array(numberOfRules).keys()].map(num => num.toString(colors).padStart(numberOfInputs, EMPTY));
}

rules = generateRules();

function evaluate(rule, pattern) {
    return rules[rule][maxIndex - parseInt(pattern, colors)];
}

function renderRow(row, columnNum, cellSize) {
    ctx.fillStyle = FILLED_COLOR;
    for(let i = 0; i < row.length; ++i) {
        if (row[i] === FILLED) {
            ctx.fillRect(cellSize * i, columnNum * cellSize, cellSize, cellSize);
        }
    }
}

function renderRule(rule, initialRow, depth, cellSize) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let row = initialRow;
    for (let level = 0; level < depth; ++level) {
        renderRow(row, level, cellSize);
        let nextRow = EMPTY 
        for (let i = 0; i < row.length - neighbors + 1; ++i) {
            const pattern = row.slice(i, i + neighbors)
            nextRow += evaluate(rule, pattern)
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

fitCanvasToWindow();

form.addEventListener("submit", event => {
    // don't refresh the page
    event.preventDefault();

    const ruleNumber = parseInt(ruleInput.value);
    const initialState = initialStateInput.value;
    const gridHeight = parseInt(gridHeightInput.value);
    const cellSize = parseInt(cellSizeInput.value);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("rule", ruleNumber);
    searchParams.set("initialState", initialState);
    searchParams.set("height", gridHeight);
    searchParams.set("cellSize", cellSize);
    window.location.search = searchParams.toString();
})


const searchParams = new URLSearchParams(window.location.search);
const ruleNumber = searchParams.get("rule");
const initialState = searchParams.get("initialState");
const gridHeight = searchParams.get("height");
const cellSize = searchParams.get("cellSize");

if (ruleNumber) {
    console.log(ruleNumber)
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

renderRule(parseInt(ruleNumber), initialState, parseInt(gridHeight), parseInt(cellSize));