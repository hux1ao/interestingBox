Function.prototype.myCall = function (context) {
    context.fn =  this;
    const args = Array.from(arguments).slice(1);
    const result = context.fn(...args);
    delete context.fn;
    return result;
}

function Aa (num) {
    this.aa = num;
}
function Bb (number) {
    this.bb = number;
}
const bb = new Bb(1);
Aa.myCall(bb, 22);
console.log(bb);