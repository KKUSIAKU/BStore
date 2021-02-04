const crypto = require('crypto');
// furter memory allocation interface
class Store {
  constructor() {
    this._BNodes = {};
    this._size = 0;
    this._indexes = 0;
    this._freeIndexes = [];
  }

  get isEmpty() {
    return !this._size
  }

  get size() {
    return this._size
  }

  read(index) {
    return this._BNodes[index]
  }

  write(index, data) {
    this._BNodes[index] = data;
    this._freeIndexes = this._freeIndexes.filter((i) => i !== index);
    this._size += 1;
  }

  // make it sync
  getIndex() {
    let index = this._freeIndexes.shift();
    if(!index) {
      const hash = crypto.createHash('sha256');
      this._indexes += 1;
      hash.update('store' + this._indexes);
      index = hash.digest('hex');
    }
    
    return index;
  }

  put(data) {
    const index = this.getIndex();
    this._BNodes[index] = data;
    return index;
  }

  remove(index) {
    this._BNodes[index] = null;
    this._freeIndexes.push(index);
    this._size -= 1;
  }
}


class TreeNode {
  constructor(value, size, getSetter) {
    this.children = [];
    this._size = size || 2;
    this.id = null;
    this.keys = TreeNode.createIndexArray(this._size);
  }

  static createIndexArray(size) {
    const arr = [];
    for (let i=0; i < 2*size; i+=1) {
      arr.push(null)
    }
    return arr;
  }

  get isRoot() {
    return !this.parent;
  }

  get isLeaf() {
    return !this.children.length
  }

  get isOverFull() {
    return this.keys.filter((key) => key).length == 2 * this._size ;
  }

  set id(value) {
    this._id = value;
  }

  get id() {
    return this._id;
  }

  addChildBNode(index) {
    if (this.isFull) {
      throw RangeError('BNode is full')
    }
    this.children.push(index)

  }

  addKeys(key) {
    if (!key) {
      throw TypeError('Key could not be undenifed')
    }

    if (this.isOverFull) {
      throw RangeError('BNode is full')
    }

    if (this.keys.find((_key) => _key === key)) {
      throw TypeError('Duplicate key error')
    }

    let index = this.keys.findIndex((_key) => _key > key);
    if (index >= 0) {
      const preIndex = this.keys.slice(0, index);
      const prostIndex = this.keys.slice(index);
      preIndex.push(key);
      this.keys = preIndex.concat(prostIndex);
    } else {
      index = this.keys.findIndex((_key) => !_key);
      this.keys[index] = key
    }
  }

  // append(value) {
  //   if (this.isOverFull) {
  //     throw RangeError('BNode is full')
  //   } else {
  //     this.addKeys(value)
  //   }
  // }

  // this will not clear the value in the store,
  // use only after BNode content have been put in the store
  clear() {
    this.value = null;
  }

  split() {
    // TODO: deeply clone to check for next step
    const newBNode = new TreeNode();
    newBNode.children = this.children.slice(this._size);
    for (let i = this._size; i < this.keys.length; i += 1){
      newBNode.keys[i - this._size] = this.keys[i]
    }

    for (let k = this._size; k < this.keys.length; k += 1){
      this.keys[k] = null
    }

    return newBNode;
  }

  getKey() {
    return this.value
  }

  *[Symbol.iterator]() {
    let index = 0;
    while (index < this.children.length - 1) {
      step = yield this.children[index];
      if (step && step > index + 1) {
        index = step;
      } else {
        index += 1;
      }
    }
  }
}


class Tree {
  constructor(dimension) {
    this._store = new Store();
    this._rootBNode = null;
    this._dimension = dimension || 2;
    this.inserRoot();
  }

  insert(value) {
    const newTreeNode = this.insertInTree(value, this._rootBNode.id)
    if (newTreeNode) {
      const key = this._rootBNode.keys[this._dimension - 1];
      // node safe need a special method in Node class may be
      this._rootBNode.keys[this._dimension - 1] = null;
      const newTreeNodeID = this._store.getIndex();
      newTreeNode.id = newTreeNodeID;
      this._store.write(newTreeNode.id, newTreeNode);

      const newRootNode = new TreeNode();
      const newRootID = this._store.getIndex();
      newRootNode.id = newRootID;
      newRootNode.addKeys(key);
      newRootNode.children.push(this._rootBNode.id, newTreeNode.id);
      this._store.write(newRootNode.id, newRootNode);
      this._rootBNode = newRootNode;
    }
    return true;
  }

  findInTree(value, BNode) {
    let vIndex = BNode.keys.findIndex((key) => key >= value);

    if (vIndex < 0) {
      vIndex = BNode.keys.findIndex((key) => !key);
    }
    return vIndex;
  }

  find(value) {
    const id = this._rootBNode.id;
    let BNode = this._store.read(id);
    let keyIndex = this.findInTree(value, BNode);

    let step = 10;
    while (BNode.keys[keyIndex] !== value && !BNode.isLeaf && step) {
      BNode = this._store.read(BNode.children[keyIndex]);
      keyIndex = this.findInTree(value, BNode)
      step -= 1;
    }

    return BNode.keys[keyIndex];
  }

  insertInTree(value, BNodeId) {
    const BNode = this._store.read(BNodeId)
    const index = this.findInTree(value, BNode)
    if (!BNode.children[index]) {
      BNode.addKeys(value)
      this._store.write(BNode.id, BNode);
    } else {
      let nextBNode = this.insertInTree(value, BNode.children[index]);
      if (nextBNode) {
        let key = nextBNode.keys.shift();
        this._store.write(nextBNode.id, nextBNode)
        BNode.addKeys(key)
        this._store.write(BNode.ui, BNode)
      }
    }

    if (BNode.isOverFull) {
      return BNode.split();
    }

    return null;
  }

  // should be not numerable 
  inserRoot() {
    this._rootBNode = new TreeNode();
    const index = this._store.getIndex();
    this._rootBNode.id = index;
    this._store.write(this._rootBNode.id, this._rootBNode);
  }
}


exports.TreeNode = TreeNode;
exports.Tree = Tree;
exports.Store = Store;
module.exports = exports;