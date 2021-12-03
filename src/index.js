const express = require('express');
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

const Model = require('./lib/model');
const Util = require('./lib/util');

const app = express();

class App extends Model
{
  constructor() {
    super();

    this.util = Util;
    this.port = process.env.PORT || 9000
  }

  setResponse(response, data) {
    response.status(data.data.status);
    response.statusMessage = data.data.statusMessage;
    response.send(data.data);
  }

  middleware() {
    app.use((_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
  
      next();
    })

    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(bodyParser.json());
    app.use(upload.array());

    this.controllerMiddleware = (request, _response, next) => {
      try {
        const controllerName = this.util.firstLetterCapitalize(request.params.controller);
  
        this.controller = require(`./controller/${controllerName}Controller`);
      } catch(err) {
        console.log(err);
      }
      next();
    };

    this.authMiddleware = (request, response, next) => {
      try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = this.jwt.verify(token, process.env.SECRET);
        const email = decodedToken.userId;
        if (request.body.email && request.body.email !== email) {
          throw 'Invalid user ID';
        } else {
          next();
        }
      } catch {
        response.status(401).json({
          error: new Error('Invalid request!')
        });
      }
    }
  }

  start() {
    this.middleware();

    app.route('/:controller/:id?')
      .post(this.controllerMiddleware, (request, response) => {
        this.controller.create(request.body)
          .then(res => {
            this.setResponse(response, res);
          }).catch(error => {
            this.setResponse(response, error);
          });
      })
      .get(this.controllerMiddleware, (request, response) => {
        this.controller.read(request.params.id)
          .then(res => {
            this.setResponse(response, res);
          }).catch(error => {
            this.setResponse(response, error);
          });
      })
      .put(this.controllerMiddleware, (request, response) => {
        this.controller.update(request.params.id, request.body)
          .then(res => {
            this.setResponse(response, res);
          }).catch(error => {
            this.setResponse(response, error);
          });
      })
      .delete(this.controllerMiddleware, (request, response) => {
        this.controller.delete(request.params.id)
          .then(res => {
            this.setResponse(response, res);
          }).catch(error => {
            this.setResponse(response, error);
          });
      })

    app.listen(this.port);
  }
}

const application = new App();
application.start();