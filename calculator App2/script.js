"use strict";

//*Selected Elements
const display = document.getElementById("display");
const buttonContainer = document.querySelector(".btn-container");

//* checks whether token is an operator or not
const isOperator = (token) => ["+", "-", "x", "÷"].includes(token);

//* checks to see which operator should be executed first in the expression
function getOperatorPrecedence(operator) {
  switch (operator) {
    case "x":
    case "÷":
      return 2;
    case "+":
    case "-":
      return 1;
    default:
      throw new Error(
        `Cannot get precedence to unknown operator '${operator}'`
      );
  }
}

//* after checking for operator precedence, it checks which
function isLeftAssociative(operator) {
  switch (operator) {
    case "x":
    case "÷":
    case "+":
    case "-":
      return true;
    default:
      throw new Error(
        `cannot get associativity for unknown operator ${operator}`
      );
  }
}

//*evaluates based off operator
function evaluateOperator(operator, a, b) {
  switch (operator) {
    case "x":
      return a * b;
    case "÷":
      return a / b;
    case "+":
      return a + b;
    case "-":
      return a - b;
    default:
      throw new Error(`Cannot apply unknown operator ${operator}`);
  }
}

function shuntingYard(tokens) {
  const operatorStack = [];
  const outputQueue = [];

  // let o1;
  while (tokens.length > 0) {
    const token = tokens.shift();
    console.log(token);

    if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (operatorStack[operatorStack.length - 1] !== "(") {
        if (operatorStack.length === 0) {
          return `Error: there are Mismatched Parentheses`;
        }
        const operator = operatorStack.pop();
        outputQueue.push(operator);
      }

      if (operatorStack[operatorStack.length - 1] !== "(") {
        return `Error there are Mismatched Parentheses`;
      }

      operatorStack.pop();
    } else if (isOperator(token)) {
      const o1 = token;

      //prettier-ignore
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        (getOperatorPrecedence(operatorStack[operatorStack.length - 1]) > getOperatorPrecedence(o1)
        || (getOperatorPrecedence(operatorStack[operatorStack.length - 1]) == getOperatorPrecedence(o1) && isLeftAssociative(o1)))
      ) {
        const o2 = operatorStack.pop();
    
        outputQueue.push(o2);
        console.log(outputQueue)
      }
      operatorStack.push(o1);

      console.log(operatorStack);
    } else {
      outputQueue.push(token);
    }
  }

  return outputQueue;
}

function stackMachine(instructions) {
  const stack = [];
  // console.log(stack);
  while (instructions.length > 0) {
    const nextChar = instructions.shift();

    if (!isOperator(nextChar)) {
      if (nextChar.indexOf(".") !== nextChar.lastIndexOf("."))
        return `Error: Multiple decimal points in one number ${nextChar}`;

      stack.push(parseFloat(nextChar));
    } else {
      if (isOperator(nextChar)) {
        if (stack.length === 0)
          return `Error: Number Missing for operator ${nextChar}`;
        const right = stack.pop();

        if (stack.length === 0)
          return `Error: Number Missing for operator ${nextChar}`;
        const left = stack.pop();

        stack.push(evaluateOperator(nextChar, left, right));
      }
    }
  }
  if (stack.length !== 1) return `Error: Missing Result`;
  return stack.pop();
}

function evaluate(expression) {
  //Tokenize
  const tokens = expression.split(/([-x+÷()])/g).filter((t) => t.length > 0);

  //shunting yard
  const output = shuntingYard(tokens);
  console.log(output);

  //stack machine
  return stackMachine(output);
}

buttonContainer.addEventListener("click", function (e) {
  const button = e.target;

  if (
    e.target.classList.contains("num") ||
    e.target.classList.contains("operator") ||
    e.target.classList.contains("dec")
  ) {
    display.innerHTML += button.textContent;
  } else if (button.classList.contains("del")) {
    display.textContent = display.textContent.slice(0, -1);
  } else if (button.classList.contains("clear")) {
    display.textContent = "";
  } else if (button.classList.contains("equal")) {
    display.textContent = evaluate(display.textContent);
  }
});
