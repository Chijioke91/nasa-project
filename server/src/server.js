const http = require('http');
const { connectMongoDB } = require('./services/mongo');
require('dotenv').config();

const app = require('./app');
const { loadPlanetData } = require('./models/planets.model');

const port = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
  await connectMongoDB();

  await loadPlanetData();

  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();
