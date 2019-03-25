function Queue (array) {
    this.data = array;
    this.head = 0;
    this.tail = array.length;
}
/**
 * 
 * @param {*} array 
 */
function getQQNumber (array) {
    const queue = new Queue(array);
    const resultArr = [];
    while(queue.head < queue.tail) {
        resultArr.push(queue.data[queue.head]);
        queue.data.push(queue.data[queue.head + 1]);
        queue.head = queue.head + 2;
        queue.tail += 1;
    }
    return resultArr;
}
console.log(getQQNumber([6, 3, 1, 7, 5, 8, 9, 2, 4]));