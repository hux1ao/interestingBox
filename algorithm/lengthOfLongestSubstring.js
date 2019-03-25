function Queue (arr) {
    this.data = new Set([arr[0]]);
    this.head = 0;
    this.tail = 0;
    this.getLength = function () {
        return this.tail - this.head + 1
    }
}
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let answer = 0;
    const stringArr = s.split('');
    const queue = new Queue(stringArr);
    while(queue.tail < stringArr.length) {
        if (queue.data.has(stringArr[queue.tail + 1])) {
            if (answer < queue.getLength()) {
                answer = queue.getLength();
            }
            const index = stringArr.indexOf(stringArr[queue.tail + 1]);
            queue.head = index + 1;
            queue.tail += 1;
        } else {
            queue.data.add(stringArr[queue.tail + 1])
            queue.tail += 1;
        }
    }
    return answer;
};
console.log(lengthOfLongestSubstring('bbbbbb'))