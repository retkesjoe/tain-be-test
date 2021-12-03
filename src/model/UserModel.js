const Model = require('../lib/model');

class UserModel extends Model
{
  constructor() {
    super();
  }

  getUserByEmail(email) {
    return new Promise((resolve) => {
      this.ado.getRow(`
        SELECT email, password, name
        FROM user
        WHERE email = ?
      `, [email], (result) => {
        resolve(result);
      })
    });
  }

  createUser(name, email, password) {
    this.ado.insert('user', {name: name, email: email, password: password}, () => {});
  }
}

module.exports = new UserModel();