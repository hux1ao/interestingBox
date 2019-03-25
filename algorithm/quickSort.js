const arr = [5, 7, 2, 9, 3, 8, 4, 7, 1];
/**
 * 实现快速排序
 * @param {*} array 
 */
function quickSort (array) {
    if (array.length < 2) {
        return array;
    }
    let baseNum = array[0];
    const leftArr = array.filter(function (val) {
        return val < baseNum
    })
    const rightArr = array.filter(function (val) {
        return val > baseNum
    })
    return quickSort(leftArr).concat([baseNum], quickSort(rightArr));
}
console.log(quickSort(arr));
