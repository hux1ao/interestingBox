// 给定一个 N 叉树，找到其最大深度。
// 最大深度是指从根节点到最远叶子节点的最长路径上的节点总数。
// 说明:
// 树的深度不会超过 1000。
// 树的节点总不会超过 5000。

/**
 * Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */
/**
 * @param {Node} root
 * @return {number}
 */
var maxDepth = function (root) {
    let maxLength;
    let tempLength;
    function getMaxLength (root) {
        if (!root.children) {
            if (tempLength > maxLength) {
                maxLength = tempLength;
            }
        }
        for (let i = 0; i < root.length; i ++ ) {
            tempLength++;
            getMaxLength(root.children[i]);
            tempLength--;
        }
    }
    getMaxLength();
    return maxLength;
};
// {"$id":"1","children":[{"$id":"2","children":[{"$id":"5","children":[],"val":5},{"$id":"6","children":[],"val":6}],"val":3},{"$id":"3","children":[],"val":2},{"$id":"4","children":[],"val":4}],"val":1}