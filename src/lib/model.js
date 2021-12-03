"use strict";
const axios = require('axios');

/* TODO JWT token for the authenticated users */
const jwt = require('jsonwebtoken');

const Ado = require("./ado");

class Model
{
  constructor() {
    this.axios  = axios;
    this.ado    = Ado;
    this.jwt    = jwt;
  }
}

module.exports = Model;
