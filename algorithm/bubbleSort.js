/**
 * 实现冒泡排序
 * @param {*} array 
 */
function buddleSort (array) {
    const length = array.length;
    for (let i = 0; i < length; i++) {
        for(let j = 0;j < length - i; j++) {
            if (array[j] > array[j + 1]) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
    return array;
}
console.log(buddleSort([8, 100, 50, 22, 15, 6, 1, 1000, 99]));