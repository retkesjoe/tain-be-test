const Model = require("../lib/model");

class GamepresenterModel extends Model
{
  constructor() {
    super();
  }

  create(data) {
    this.ado.insert("game_presenter", {name: data.name}, () => {});
  }

  read() {
    return new Promise((resolve) => {
      this.ado.getAll(`
        SELECT *
        FROM game_presenter
      `, [], [], (result) => {
        resolve(result);
      })
    });
  }

  readOne(id) {
    return new Promise((resolve) => {
      this.ado.getRow(`
        SELECT *
        FROM game_presenter
        WHERE id = ?
      `, [id], (result) => {
        resolve(result);
      })
    });
  }

  update(id, data) {
    this.ado.update("game_presenter", data, "id", () => {})
  }

  delete(id) {
    this.ado.delete("game_presenter", id, "id", () => {});
  }
}

module.exports = new GamepresenterModel();