const Gamepresenter = require('../model/GamepresenterModel');

class GamepresenterController
{
  constructor()
  {
    this.model = Gamepresenter;
  }

  create(data) {
    return new Promise(resolve => {
      this.model.create(data);

      resolve({
        data: {
          status: 201,
          statusMessage: 'Game presenter has been created',
          data: {
            name: data.name
          }
        }
      });
    });
  }

  read(id) {
    if (id === undefined) {
      return new Promise(resolve => {
        this.model.read().then(res => {
          resolve({
            data: {
              status: 200,
              statusMessage: 'Get all game presenter',
              data: res
            }
          })
        })
      });
    } else {
      return new Promise(resolve => {
        this.model.readOne(id).then(res => {
          resolve({
            data: {
              status: 200,
              statusMessage: `Get game presenter by id ${id}`,
              data: res
            }
          })
        })
      });
    }
  }

  update(id, gamePresenter) {
    return new Promise(resolve => {
      this.read(id).then(res => {
        if (res.data.data === null || res.data.data.id === undefined) {
          resolve({
            data: {
              status: 200,
              statusMessage: `Game presenter doesn't exist`,
              data: id
            }
          })
        }

        gamePresenter["id"] = id;
        this.model.update(id, gamePresenter);

        resolve({
          data: {
            status: 200,
            statusMessage: `Game presenter #${id} has been updated`,
            data: id
          }
        })
      })
    })
  }

  delete(id) {
    return new Promise(resolve => {
      this.read(id).then(res => {
        if (res.data.data === null || res.data.data.id === undefined) {
          resolve({
            data: {
              status: 200,
              statusMessage: `Game presenter doesn't exist`,
              data: id
            }
          })
        } 

        this.model.delete(id);

        resolve({
          data: {
            status: 200,
            statusMessage: `Game presenter #${id} has been removed`,
            data: id
          }
        })
      })
    });
  }
}

module.exports = new GamepresenterController();