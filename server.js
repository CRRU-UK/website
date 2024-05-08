const next = require('next');
const express = require('express');

const winston = require('winston');
const expressWinston = require('express-winston');

const dev = process.env.NODE_ENV === 'development';
const hostname = 'localhost';
const port = 3000;

const loggerOptions = {
  meta: !dev,
  colorize: dev,
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
};

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(expressWinston.logger(loggerOptions));
  server.use(expressWinston.errorLogger(loggerOptions));

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, () => console.log(`server listening on ${port}`));
});
