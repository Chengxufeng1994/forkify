class Likes {
  constructor() {
    this.likes = [];
  }

  addLikes = (id, img, title, author) => {
    const like = {
      id, img, title, author,
    };

    this.likes.push(like);

    // Perist data in localStorage
    this.persistData();

    return like;
  };

  removeLikes = (id) => {
    const index = this.likes.findIndex((el) => el.id === id);
    this.likes.splice(index, 1);

    // Perist data in localStorage
    this.persistData();
  };

  isLiked = (id) => this.likes.findIndex((el) => el.id === id) !== -1;

  getNumLikes = () => this.likes.length;

  persistData = () => {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  };

  readStorage = () => {
    const storage = JSON.parse(localStorage.getItem('likes'));

    // Restoring
    if (storage) {
      this.likes = storage;
    }
  };
}

export default Likes;
