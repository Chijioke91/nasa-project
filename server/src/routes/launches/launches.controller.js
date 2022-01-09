const {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchWithId,
  scheduleNewLaunch,
} = require('../../models/launches.model');

exports.httpGetAllLaunches = async (req, res) => {
  return res.status(200).json(await getAllLaunches());
};

exports.httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: 'Invalid launch date' });
  }

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
};

exports.httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.launchId);

  const launchExists = await existsLaunchWithId(launchId);

  if (!launchExists) {
    return res.status(404).json({ error: 'Launch not found' });
  }

  const aborted = await abortLaunchWithId(launchId);

  console.log(aborted);

  if (!aborted) {
    return res.status(404).json({ error: 'Could not abort launch' });
  }

  return res.status(200).json({ ok: true });
};
