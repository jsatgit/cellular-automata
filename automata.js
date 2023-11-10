const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const recording = document.getElementById("recording");
const recordingCtx = recording.getContext("2d");

const neighbors = 3
const colorChoices = ["white", "black", "grey", "red", "green", "blue"]
const EMPTY = "0"
const left = Math.round((neighbors - 1) / 2)
const right = Math.round((neighbors - 1) / 2)

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
        ctx.fillStyle = colorChoices[Number(row[i])];
        ctx.fillRect(cellSize * i, columnNum * cellSize, cellSize, cellSize);
    }
}

function setCanvasSize(width, height) {
    ctx.canvas.width  = width;
    ctx.canvas.height = height;
}

function renderRule(ruleNum, initialRow, depth, cellSize, numColors) {
    setCanvasSize(initialState.length * cellSize, gridHeight * cellSize);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let row = initialRow;
    for (let level = 0; level < depth; ++level) {
        renderRow(row, level, cellSize);
        let nextRow = "";
        for (let i = 0; i < row.length; ++i) {
            const patternStart = i - left + shift;
            const patternEnd = i + right + shift + 1;
            if (patternStart >= 0 && patternStart < row.length && patternEnd > 0 && patternEnd <= row.length) {
                const pattern = row.slice(patternStart, patternEnd)
                nextRow += evaluate(ruleNum, pattern, numColors)
            } else {
                nextRow += EMPTY
            }
        }
        row = nextRow
    }
}

const form = document.getElementById("form");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const recordButton = document.getElementById("record");
const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");

function renderScreen() {
    renderRule(ruleNumber, initialState, gridHeight, cellSize, numColors);
}

let playId = null;

function pause() {
    if (playId !== null) {
        clearInterval(playId);
        playId = null;
    }
}

pauseButton.addEventListener("click", pause)


playButton.addEventListener("click", () => {
    if (!playId && ruleNumber <= 255) {
        record()
        playId = setInterval(() => {
            const parsedJson = getInputs();
            ruleNumber += 1

            if (ruleNumber > 255) {
                pause()
                return;
            }

            parsedJson["rule"] = ruleNumber
            inputArea.value = JSON.stringify(parsedJson, null, 4)
            renderScreen()
            record()
        }, playDelay)
    }
})

let ruleNumber;
let initialState;
let gridHeight;
let cellSize;
let numColors;
let playDelay;
let shift;

let widthOffset = 0
let heightOffset = 0
let numberOfRecordings = 0

let MAX_NUM_RECORDING_ROWS = 16; 
let MAX_NUM_RECORDING_COLS = 16; 
let MAX_NUM_RECORDINGS = MAX_NUM_RECORDING_COLS * MAX_NUM_RECORDING_ROWS 

function record() {
    recordingCtx.drawImage(canvas, widthOffset, heightOffset);
    widthOffset += initialState.length * cellSize
    numberOfRecordings += 1

    if (numberOfRecordings % MAX_NUM_RECORDING_COLS === 0) {
        widthOffset = 0;
        heightOffset += gridHeight * cellSize
    }

    if (numberOfRecordings >= MAX_NUM_RECORDINGS) {
        widthOffset = 0
        heightOffset = 0
    }
}

recordButton.addEventListener("click", record)


function getInputs() {
    try {
        const parsedJson = JSON.parse(inputArea.value) 
        ruleNumber = parseInt(parsedJson["rule"]);
        initialState = parsedJson["initialState"];
        gridHeight = parseInt(parsedJson["levels"]);
        cellSize = parseInt(parsedJson["cellSize"]);
        numColors = parseInt(parsedJson["numColors"]);
        playDelay = parseInt(parsedJson["playDelay"]);
        shift = parseInt(parsedJson["shift"]);

        outputArea.innerHTML = "";
        return parsedJson;
    } catch(error) {
        outputArea.innerHTML = "invalid input";
    }
}


form.addEventListener("submit", event => {
    // don't refresh the page
    event.preventDefault();
    getInputs()
    renderScreen()
})

getInputs()

renderScreen()

recordingCtx.canvas.width = initialState.length * cellSize * MAX_NUM_RECORDING_COLS;
recordingCtx.canvas.height = gridHeight * cellSize * MAX_NUM_RECORDING_ROWS;
