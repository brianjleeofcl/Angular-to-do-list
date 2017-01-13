'use strict';

const path = require('path');

const express = require('express');
const app = express();

app.disable('x-powered-by');




app.use(express.static(path.resolve('public'))




const port = process.env.PORT || 8000;

app.listen(port, () => {
  if (app.get('env') !== 'test') {
    // eslint-disable-next-line no-console
    console.log('Listening on port', port);
  }
});
