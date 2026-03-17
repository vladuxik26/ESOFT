function ESOFT3(s) {
    const stack = [];

    const pairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (let char of s) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else {
            if (stack.length === 0) return false;

            const last = stack.pop();

            if (last !== pairs[char]) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

console.log(ESOFT3("()"));
console.log(ESOFT3("()[]{}"));
console.log(ESOFT3("(]"));
console.log(ESOFT3("([)]"));
console.log(ESOFT3("{[]}"));
