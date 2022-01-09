const request = require('supertest');
const app = require('../../app');
const { loadPlanetData } = require('../../models/planets.model');
const { connectMongoDB, disconnectMongoDB } = require('../../services/mongo');

describe('Run all tests', () => {
  beforeAll(async () => {
    await connectMongoDB();
    await loadPlanetData();
  });

  afterAll(async () => {
    await disconnectMongoDB();
  });

  describe('Get Launches', () => {
    it('should respond with status code of 200', async () => {
      await request(app)
        .get('/v1/launches')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('Post /Launch', () => {
    const completeLaunchData = {
      mission: 'ZTM155',
      rocket: 'ZTM Experimental IS1',
      launchDate: 'January 30, 2030',
      target: 'Kepler-62 f',
    };

    const completeLaunchDataWithInvalidDate = {
      mission: 'ZTM155',
      rocket: 'ZTM Experimental IS1',
      launchDate: 'hello',
      target: 'Kepler-62 f',
    };

    const launchDataWithoutDate = {
      mission: 'ZTM155',
      rocket: 'ZTM Experimental IS1',
      target: 'Kepler-62 f',
    };

    it('should respond with status code of 201', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    it('should should catch missing property', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
    it('should should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchDataWithInvalidDate)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
