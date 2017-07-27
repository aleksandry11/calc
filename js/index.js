var input = document.getElementById('input');
var label = document.getElementById('label');
var button = document.getElementById('button');
var body = document.body;
var op = /[\/+\-\*\/\/]/;

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var evaluate = function (exp) {
    var stack = [];
    var exit = [];

    var priority = {
        '*': {priority: 3},
        '/': {priority: 3},
        '+': {priority: 2},
        '-': {priority: 2},
        '(': {priority: 1},
        ')': {priority: 1}
    }

    var expression = exp.replace(/\s/g, '');
    expression = expression.replace(/,/g, '.');
    expression = expression.split('');

    if (op.exec(expression[0])) {
        expression.unshift('0');
    }

    var lastnum = false;

    expression.forEach(function(token){
        //operators matching
        if(op.exec(token)) {
            var endop = false;
            var lastop;

            while(endop != true) {
                lastop = stack.pop();
                if (lastop === undefined) {
                   stack.push(token);
                   endop = true;
                } else {
                    var currentPriority = priority[token].priority;
                    var previousPriority = priority[lastop].priority;
                    switch(true) {
                        case (currentPriority > previousPriority):
                            stack.push(lastop);
                            stack.push(token);
                            endop = true;
                            break;
                        case (currentPriority <= previousPriority):
                            exit.push(lastop)
                            stack.push(token);
                            endop = true;
                            break;
                    }
                }
            }

            lastnum = false;
        }
        //numbers matching
        else if (/[0-9\.]/.exec(token)) {
            if (lastnum === true) {
                var num = exit.pop();
                num = num + token;
                exit.push(num);
            } else {
                exit.push(token);
                lastnum = true;
            }
        }
        //brackets matching
        else if (token === '(') {
            stack.push(token);
            lastnum = false;
        }
        else if (token === ')') {
            var bracket = false;
            while (bracket != true) {
                var operator = stack.pop();
                if (operator === '(') {
                    bracket = true;
                } else {
                    exit.push(operator);
                }
            }
            lastnum = false;
        }
    });
    while(stack.length > 0) {
        exit.push(stack.pop());
    }
    return exit.join(' ');
}

var calc = function (exp) {
    var stack = [];
    var result;
    var tokens = exp.split(' ');

    for (var i = 0; i < tokens.length; i++ ) {

        if (isNumber(tokens[i])) {
            stack.push(parseFloat(tokens[i]));
        } else if (op.exec(tokens[i])) {
            if (stack.length < 2) {
                label.innerText = 'Not enough operands for ' + tokens[i] + ' operation';
                throw new Error('Error');

            }
            var b = stack.pop();
            var a = stack.pop();
            switch (tokens[i]) {
                case '*': result = a * b; break;
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '/': result = a / b; break;
            }
            stack.push(result);
        }
        if (!isNumber(tokens[i]) && !op.exec(tokens[i])) {
            label.innerText = 'Unknown tokens'
        }
    }
    return result;
}

button.addEventListener('click', function (event) {
    label.innerText = calc(evaluate(input.value));
})

body.addEventListener('keyup', function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        label.innerText = calc(evaluate(input.value));
    }
})