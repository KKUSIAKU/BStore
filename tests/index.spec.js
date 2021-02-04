
const { TreeNode, Store, Tree } = require('../index');

describe('Node test', () => {

  it('New created node should be root', () => {
    const treeNode = new TreeNode();
    expect(treeNode.isRoot).toBe(true);
  })

  it('New created node should be leaf', () => {
    const treeNode = new TreeNode();
    expect(treeNode.isLeaf).toBe(true);
  })

  it('Should have empty children on create', () => {
    const node = new TreeNode();
    expect(node.children).toBeTruthy();
    expect(node.children.length).toBeFalsy()
  })

  it('Should have a keys array props', () => {
    const node = new TreeNode();
    expect(node.keys).toBeTruthy();
  })

  it('Should have a keys array props of length 5 by default', () => {
    const node = new TreeNode();
    expect(node.keys.length).toBe(4);
  })

  it('Should error when trying to add more key while full', () => {
    const node = new TreeNode();
    expect(() => {
      node.addKeys('one1');
      node.addKeys('one2');
      node.addKeys('one3');
      node.addKeys('one4');
      node.addKeys('one5');
      node.addKeys('one6');
      console.log(node.keys)
    }).toThrow('BNode is full')
  })

  it('Should error when trying to existing key ', () => {
    const node = new TreeNode();
    expect(() => {
      node.addKeys('one');
      node.addKeys('one');
    }).toThrow('Duplicate key error')
  })

  it('Should insert keys in order', () => {
    const node = new TreeNode();
    node.addKeys('one1');
    node.addKeys('one3');
    node.addKeys('one2');
    node.addKeys('one4');
    expect(node.keys.slice(0, 4)).toEqual(['one1', 'one2', 'one3', 'one4']);
  })

  it('should split node in regard of size: default = 2, test current node', () => {
    const node = new TreeNode();
    node.addKeys('one1');
    node.addKeys('one2');
    node.addKeys('one3');
    node.addKeys('one4');
    node.split();
    expect(node.keys.length).toBe(4)
    expect(node.keys).toEqual(['one1', 'one2', null, null])
  })

  it('should split node in regard of size: default = 2, test return new node', () => {
    const node = new TreeNode();
    node.addKeys('one1');
    node.addKeys('one2');
    node.addKeys('one3');
    node.addKeys('one4');
    const newNode = node.split();
    expect(newNode.keys.length).toBe(4)
    expect(newNode.keys).toEqual(['one3', 'one4', null, null])
  })
})


describe('Store test', () => {

  it('Could create an empty store', () => {
    const store = new Store();
    expect(store.isEmpty).toBe(true);
  })

  it('Should increment size on write', () => {
    const store = new Store();
    expect(store.isEmpty).toBe(true);
    store.write('1', 'data')
    expect(store.isEmpty).toBeFalsy()
    expect(store.size).toBe(1)
  })
})

describe('Tree testing search functionality', () => {

  describe('Search on root node', () => {
    const tree = new Tree();
    tree.insert('node1')
    tree.insert('node2')
    tree.insert('node4')
    it('Should indicate not found but returning null', () => {
      const search = tree.find('node');
      expect(search).toBeTruthy();
      expect(search).toBe('node1')
    })

    it('Should return the search term', () => {
      const search = tree.find('node1');
      expect(search).toBe('node1');
    })
    it('Should return the search term', () => {
      const search = tree.find('node4');
      expect(search).toBe('node4');
    })
  })

  describe('Insertion root node', () => {

    it('Should insert tree first value on root node ', () => {
      const tree = new Tree();
      tree.insert('node1')
      tree.insert('node2')
      tree.insert('node3')
      expect(tree._rootBNode.isLeaf).toBeTruthy()
      expect(tree._rootBNode.isRoot).toBeTruthy()
    })

    it('Should split root node on the fourth insertion', () => {
      const tree = new Tree();
      const initialRootId = tree._rootBNode.id;
      expect(tree._rootBNode.children.length).toEqual(0)
      tree.insert('node1')
      tree.insert('node2')
      tree.insert('node3')
      tree.insert('node4')
      tree.insert('node5')
      expect(tree._rootBNode.children.length).toEqual(2)
    })

    it('Should split root node and add children two new root', () => {
      const tree = new Tree();
      const initialRootId = tree._rootBNode.id;
      tree.insert('node1')
      tree.insert('node2')
      tree.insert('node3')
      tree.insert('node4')
      tree.insert('node5')
      expect(tree._rootBNode.children[0]).toEqual(initialRootId)
    })

    it('Should split root and root node should have own key node2', () => {
      const tree = new Tree();
      tree.insert('node1')
      tree.insert('node2')
      tree.insert('node3')
      tree.insert('node4')
      tree.insert('node5')
      expect(tree._rootBNode.keys[0]).toEqual('node2');
    })

    // it('Should split node on the fifth node', () => {
    //   const tree = new Tree();
    //   tree.insert('node1')
    //   tree.insert('node2')
    //   tree.insert('node3')
    //   tree.insert('node4')
    //   // tree.insert('node5')
    //   const searchNode = tree.find('node1');
    //   console.log(searchNode)
    //   expect(searchNode).toBeTruthy();
    // })
  })
})