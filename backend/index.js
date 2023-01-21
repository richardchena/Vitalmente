const { config } = require('./app/config')

const app = require('./app');

const port = config.port_server

const server = app.listen(port, () => {
  console.log(`Listening: http://localhost:${server.address().port}`);
});