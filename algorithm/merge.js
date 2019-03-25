// 合并数组中相邻且重复的元素
// 说明：请实现一个函数 merge，传入一个数组，合并数组中【相邻且重复】的元素。
// 示例：
// merge([3,2,2,4,5,5,6,2,1]); // 输出[3,2,4,5,6,2,1]
// merge([3,2,3]); // 输出[3,2,3]
// merge([2,2,3]); // 输出[2,3]
function merge (array) {
    return array.filter(function (val, index, self) {
        return val !== self[index + 1]
    })
}
console.log(merge([3,2,2,4,5,5,6,2,1]))