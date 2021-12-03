"use strict";

class Util {
  isset(obj, ...args/*, level1, level2, ... levelN*/) {

    if (!obj) {
      return false;
    }

    for (let i = 0; i < args.length; i++) {
      if (!obj || !Object.prototype.hasOwnProperty.call(obj, args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }

  firstLetterCapitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  validateEmail(emailAddress) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)) {
      return (true)
    }

    return (false)
  }

  validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,24}$/;

    if(password.match(regex)) { 
      return true;
    }

    return false;
  }
}

module.exports = new Util();