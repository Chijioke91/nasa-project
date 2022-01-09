const launchesDb = require('./launches.mongo');
const planets = require('./planets.mongo');

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

const DEFAULT_FLIGHT_NUMBER = 100;

saveLaunch(launch);

const getAllLaunches = async () => {
  return await launchesDb.find({}, { _id: 0, __v: 0 });
};

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error('No matching Planet was Found');
  }

  await launchesDb.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

const existsLaunchWithId = async (launchId) => {
  return launchesDb.findOne({ flightNumber: launchId });
};

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

const abortLaunchWithId = async (launchId) => {
  const aborted = await launchesDb.updateOne(
    {
      flightNumber: launchId,
    },
    { success: false, upcoming: false }
  );

  return aborted.modifiedCount === 1;
};

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchWithId,
};
