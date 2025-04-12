const supertest = require('supertest');
const app = require('../src/index');
const Photo = require('../src/models/photo.model');

// Mock data
const mockPhotos = [
  {
    id: "1",
    title: "Dewdrops on Spiderweb",
    photographer: "Jane Doe",
    camera_model: "Canon EOS 5D Mark IV"
  }
];

// Mock implementation
jest.mock('../src/models/photo.model', () => {
  return {
    findAll: jest.fn(() => Promise.resolve(mockPhotos)),
    findByPk: jest.fn(id => Promise.resolve(mockPhotos.find(p => p.id === id))),
    create: jest.fn(photoData => {
      if (!photoData.title || !photoData.photographer) {
        throw new Error('Validation error');
      }
      const newPhoto = { id: "2", ...photoData };
      mockPhotos.push(newPhoto);
      return Promise.resolve(newPhoto);
    }),
    update: jest.fn((values, options) => {
      const photo = mockPhotos.find(p => p.id === options.where.id);
      if (photo) {
        Object.assign(photo, values);
        return Promise.resolve([1, [photo]]);
      }
      return Promise.resolve([0, []]);
    }),
    destroy: jest.fn(options => {
      const index = mockPhotos.findIndex(p => p.id === options.where.id);
      if (index !== -1) {
        mockPhotos.splice(index, 1);
        return Promise.resolve(1);
      }
      return Promise.resolve(0);
    })
  };
});

describe('Macro Photography API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/photos', () => {
    it('should return all photos', async () => {
      const response = await supertest(app).get('/api/photos');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        payload: mockPhotos
      });
    });
  });

  describe('GET /api/photos/:id', () => {
    it('should return a specific photo', async () => {
      const response = await supertest(app).get('/api/photos/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        payload: mockPhotos[0]
      });
    });

    it('should return 404 for non-existent photo', async () => {
      Photo.findByPk.mockResolvedValueOnce(null);
      const response = await supertest(app).get('/api/photos/999');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/photos', () => {
    it('should create a new photo', async () => {
      const newPhoto = {
        title: "New Photo",
        photographer: "Photographer",
        camera_model: "Model"
      };
      const response = await supertest(app)
        .post('/api/photos')
        .send(newPhoto);
      expect(response.status).toBe(201);
    });

    it('should return 400 for invalid data', async () => {
      const response = await supertest(app)
        .post('/api/photos')
        .send({ photographer: "Missing title" });
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/photos/:id', () => {
    it('should update a photo', async () => {
      const response = await supertest(app)
        .put('/api/photos/1')
        .send({ title: "Updated Title" });
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent photo', async () => {
      Photo.update.mockResolvedValueOnce([0, []]);
      const response = await supertest(app)
        .put('/api/photos/999')
        .send({ title: "Updated Title" });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/photos/:id', () => {
    it('should delete a photo', async () => {
      const response = await supertest(app).delete('/api/photos/1');
      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent photo', async () => {
      Photo.destroy.mockResolvedValueOnce(0);
      const response = await supertest(app).delete('/api/photos/999');
      expect(response.status).toBe(404);
    });
  });
});