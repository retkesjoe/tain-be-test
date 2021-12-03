const crypto = require('crypto');

const User = require('../model/UserModel');
const Util = require('../lib/util');

class UserController
{
  constructor()
  {
    this.model = User;
  }

  registration({name, email, password, repassword}) {

    return new Promise(resolve => {
      const errorMessages = [];

      this.model.getUserByEmail(email).then(res => {
        if (res && res.email.length > 0) {
          errorMessages.push('Email is already exists')
        }

        if (name.length == 0) {
          errorMessages.push('The name is required');
        }
    
        if (!Util.validateEmail(email)) {
          errorMessages.push('Invalid email address');
        }
    
        if (!Util.validatePassword(password)) {
          errorMessages.push('8 to 24 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character')
        }
    
        if (password != repassword) {
          errorMessages.push('Password and repassword must be the same');
        }
    
        if (errorMessages.length > 0) {
          resolve({
            status: 200,
            statusMessage: 'Accepted',
            data: {
              status: 200,
              statusMessage: 'Accepted',
              error: errorMessages.join('.\n')
            }
          });
        }
    
        const hash = crypto.createHash('sha256');
        this.model.createUser(name, email, hash.update(password).digest('hex'));
    
        resolve({
          status: 200,
          statusMessage: 'User has been created',
          data: {
            status: 200,
            statusMessage: 'User has been created',
            data: {
              name: name,
              email: email,
            }
          }
        });
      });
    });
  }
  
  auth({email, password}) {
    return new Promise((resolve) => {
      this.model.getUserByEmail(email).then(res => {
        if (!res || res.password !== crypto.createHash('sha256').update(password).digest('hex')) {
          resolve({
            status: 201,
            statusMessage: 'Created',
            data: 'Wrong email or password'
          });
        } else {
          resolve({
            status: 201,
            statusMessage: 'Created',
            data: {
              status: 201,
              statusMessage: 'Created',
              data: {
                name: res.name,
                email: res.email,
                token: this.model.jwt.sign({name: res.name, email: res.email}, process.env.SECRET)
              }
            }
          })
        }
      })
    });
  }
}

module.exports = new UserController();