const { Router } = require('express');
const { httpGetAllPlanets } = require('./planets.controllers');

const planetsRouter = Router();

planetsRouter.route('/').get(httpGetAllPlanets);

module.exports = planetsRouter;
