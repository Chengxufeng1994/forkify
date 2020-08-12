import uniqid from 'uniqid';

class List {
  constructor() {
    this.items = [];
  }

  addItem = (count, unit, ingredient) => {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);

    return item;
  };

  removeItem = (id) => {
    // [2, 4, 8] splice(1, 1) => return 4, original array [2, 8]
    // [2, 4, 8] splice(1, 2) => return [4, 8], original array [2]
    // [2, 4, 8] slice(1, 1) => return 4, original array [2, 4, 8]
    const index = this.items.findIndex((el) => el.id === id);
    this.items.splice(index, 1);
  };

  updateCount = (id, newCount) => {
    const updateItem = this.items.find((el) => el.id === id);
    updateItem.count = newCount;
  };
}

export default List;
