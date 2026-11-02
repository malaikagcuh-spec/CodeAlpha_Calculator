const display = document.getElementById("display");

let expression = "";
let resultShown = false;


// Update display
function updateDisplay() {
    display.value = expression || "0";
}


// Enter numbers
function inputNumber(number) {

    if (resultShown) {
        expression = "";
        resultShown = false;
    }

    expression += number;
    updateDisplay();
}


// Enter decimal
function inputDecimal() {

    if (resultShown) {
        expression = "";
        resultShown = false;
    }

    const parts = expression.split(/[+\-×÷]/);
    const currentNumber = parts[parts.length - 1];

    if (!currentNumber.includes(".")) {
        expression += currentNumber === "" ? "0." : ".";
    }

    updateDisplay();
}


// Select operator
function chooseOperator(op) {

    if (expression === "" && op !== "-") return;

    if (/[+\-×÷]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }

    expression += op;
    resultShown = false;

    updateDisplay();
}


// Calculate result
function calculate() {

    if (expression === "" || /[+\-×÷.]$/.test(expression)) {
        return;
    }

    const tokens = expression.match(/(?:\d+\.?\d*|\.\d+)|[+\-×÷]/g);

    if (!tokens || tokens.join("") !== expression) return;

    let numbers = [];
    let operators = [];

    for (let i = 0; i < tokens.length; i++) {

        if (i % 2 === 0) {
            numbers.push(Number(tokens[i]));
        } else {
            operators.push(tokens[i]);
        }
    }

    // Multiplication and division first
    for (let i = 0; i < operators.length; i++) {

        if (operators[i] === "×" || operators[i] === "÷") {

            let result;

            if (operators[i] === "×") {
                result = numbers[i] * numbers[i + 1];
            } else {

                if (numbers[i + 1] === 0) {
                    expression = "Error";
                    resultShown = true;
                    updateDisplay();
                    return;
                }

                result = numbers[i] / numbers[i + 1];
            }

            numbers.splice(i, 2, result);
            operators.splice(i, 1);
            i--;
        }
    }

    // Addition and subtraction
    let answer = numbers[0];

    for (let i = 0; i < operators.length; i++) {

        if (operators[i] === "+") {
            answer += numbers[i + 1];
        } 
        else if (operators[i] === "-") {
            answer -= numbers[i + 1];
        }
    }

    expression = String(Number(answer.toPrecision(12)));
    resultShown = true;

    updateDisplay();
}


// Clear calculator
function clearDisplay() {
    expression = "";
    resultShown = false;
    updateDisplay();
}


// Delete last character
function deleteNumber() {

    if (resultShown) {
        clearDisplay();
        return;
    }

    expression = expression.slice(0, -1);
    updateDisplay();
}


// Button functionality
const buttons = document.querySelectorAll(".buttons button");

buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        const value = button.textContent.trim();

        if (button.classList.contains("clear")) {
            clearDisplay();
        }

        else if (button.classList.contains("delete")) {
            deleteNumber();
        }

        else if (button.classList.contains("equal")) {
            calculate();
        }

        else if (button.classList.contains("operator")) {
            chooseOperator(value);
        }

        else if (value === ".") {
            inputDecimal();
        }

        else {
            inputNumber(value);
        }

    });

});


// Keyboard support
document.addEventListener("keydown", function(event) {

    const key = event.key;

    if (key >= "0" && key <= "9") {
        inputNumber(key);
    }

    else if (key === ".") {
        inputDecimal();
    }

    else if (["+", "-", "*", "/"].includes(key)) {

        const operator = key === "*" ? "×" :
                         key === "/" ? "÷" : key;

        chooseOperator(operator);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    else if (key === "Backspace") {
        deleteNumber();
    }

    else if (key === "Escape") {
        clearDisplay();
    }

});