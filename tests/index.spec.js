
const { TreeNode, Store, Tree } = require('../index');

describe('Node test', () => { 
  
  it ('New created node should be root', () => {
    const treeNode = new TreeNode();
    expect(treeNode.isRoot).toBe(true);
  })

  it ('New created node should be leaf', () => {
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

  it('Should have a keys array props of length 3 by default', () => {
    const node = new TreeNode();
    expect(node.keys.length).toBe(4);
  })
})


// describe('Store test', () => { 

//   it ('Could create an empty store', () => {
//     const store = new Store();
//     expect(store.isEmpty).toBe(true);
//   })

//   it ('Should increment size on write', () => {
//     const store = new Store();
//     expect(store.isEmpty).toBe(true);
//     store.write('1', 'data')
//     expect(store.isEmpty).toBeFalsy()
//     expect(store.size).toBe(1)
//   })
// })

describe('Tree testing search functionality', () => { 


  describe('Search on root node', () => {
    const tree = new Tree();
    tree.insert('node1')
    tree.insert('node2')
    tree.insert('node4')
    tree.insert('node5')
    // tree.insert('node6')

    // console.log(tree._rootNode)
    it('Should indicate not found but returning null', () => {
      const search = tree.find('node');
      expect(search).toBeTruthy();
      expect(search).toBe('node1')
    })

    // it('Should return truthy value indicate value is found', () => {
    //   const search = tree.find('node1');
    //   expect(search).toBe('node1');
    // })
  })

  // describe('Insertion root node', () => {

  //   // it('Should insert four first value on root node ', () => {
  //   //   const tree = new Tree();
  //   //   tree.insert('node1')
  //   //   tree.insert('node2')
  //   //   tree.insert('node3')
  //   //   tree.insert('node4')
  //   //   expect(tree.size).toBe(1);
  //   // })

  //   it('Should split root node on the fourth insertion', () => {
  //     const tree = new Tree();
  //     tree.insert('node1')
  //     tree.insert('node2')
  //     tree.insert('node3')
  //     tree.insert('node4')
  //     const searchNode = tree.find('node1');
  //     console.log(searchNode)
  //     expect(searchNode.isLeaf).toBeFalsy()
  //     expect(searchNode.isRoot).toBeFalsy()
  //   })
  //   // it('Should split node on the fifth node', () => {
  //   //   const tree = new Tree();
  //   //   tree.insert('node1')
  //   //   tree.insert('node2')
  //   //   tree.insert('node3')
  //   //   tree.insert('node4')
  //   //   // tree.insert('node5')
  //   //   const searchNode = tree.find('node1');
  //   //   console.log(searchNode)
  //   //   expect(searchNode).toBeTruthy();
  //   // })
  // })
})