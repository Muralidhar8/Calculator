class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.reset();
    }

    reset() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.updateDisplay();
    }

    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
        this.updateDisplay();
    }

    inputDecimal(dot) {
        if (this.waitingForSecondOperand) return;

        if (!this.displayValue.includes(dot)) {
            this.displayValue += dot;
            this.updateDisplay();
        }
    }

    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.displayValue);

        if (this.operator && this.waitingForSecondOperand) {
            this.operator = nextOperator;
            return;
        }

        if (this.firstOperand == null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.displayValue = `${parseFloat(result.toFixed(7))}`;
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
        this.updateDisplay();
    }

    calculate(firstOperand, secondOperand, operator) {
        if (operator === 'add') {
            return firstOperand + secondOperand;
        } else if (operator === 'subtract') {
            return firstOperand - secondOperand;
        } else if (operator === 'multiply') {
            return firstOperand * secondOperand;
        } else if (operator === 'divide') {
            return firstOperand / secondOperand;
        }
        return secondOperand;
    }

    updateDisplay() {
        this.displayElement.textContent = this.displayValue;
    }
}

const calculator = new Calculator(document.querySelector('.calculator-screen'));

document.querySelector('.calculator-keys').addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.dataset.action) {
        switch (target.dataset.action) {
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                calculator.handleOperator(target.dataset.action);
                break;
            case 'decimal':
                calculator.inputDecimal(target.textContent);
                break;
            case 'clear':
                calculator.reset();
                break;
            case 'calculate':
                calculator.handleOperator(calculator.operator);
                calculator.operator = null;
                calculator.waitingForSecondOperand = false;
                break;
            default:
                break;
        }
    } else {
        calculator.inputDigit(target.textContent);
    }
});