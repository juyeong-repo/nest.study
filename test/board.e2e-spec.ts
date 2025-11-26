import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { BoardModule } from '../src/board/board.module';
import { BoardDatabase } from '../src/board/database/board.database';

describe('BoardController (e2e)', () => {
  let app: INestApplication;
  let database: BoardDatabase;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BoardModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    database = moduleFixture.get<BoardDatabase>(BoardDatabase);
  });

  beforeEach(async () => {
    await database.clear();
  });

  afterAll(async () => {
    await database.clear();
    await app.close();
  });

  describe('/board (POST)', () => {
    it('should create a new board', () => {
      return request(app.getHttpServer())
        .post('/board')
        .send({
          title: 'Test Board',
          content: 'Test Content',
          author: 'Test Author',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Board');
          expect(res.body.content).toBe('Test Content');
          expect(res.body.author).toBe('Test Author');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/board')
        .send({
          title: 'Test Board',
        })
        .expect(400);
    });

    it('should validate title length', () => {
      return request(app.getHttpServer())
        .post('/board')
        .send({
          title: 'A',
          content: 'Test Content',
          author: 'Test Author',
        })
        .expect(400);
    });

    it('should reject unknown properties', () => {
      return request(app.getHttpServer())
        .post('/board')
        .send({
          title: 'Test Board',
          content: 'Test Content',
          author: 'Test Author',
          unknownField: 'should be rejected',
        })
        .expect(400);
    });
  });

  describe('/board (GET)', () => {
    it('should return empty array when no boards exist', () => {
      return request(app.getHttpServer())
        .get('/board')
        .expect(200)
        .expect([]);
    });

    it('should return all boards', async () => {
      await request(app.getHttpServer()).post('/board').send({
        title: 'Board 1',
        content: 'Content 1',
        author: 'Author 1',
      });

      await request(app.getHttpServer()).post('/board').send({
        title: 'Board 2',
        content: 'Content 2',
        author: 'Author 2',
      });

      return request(app.getHttpServer())
        .get('/board')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0].title).toBe('Board 1');
          expect(res.body[1].title).toBe('Board 2');
        });
    });
  });

  describe('/board/:id (GET)', () => {
    it('should return a board by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/board')
        .send({
          title: 'Test Board',
          content: 'Test Content',
          author: 'Test Author',
        });

      const boardId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/board/${boardId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(boardId);
          expect(res.body.title).toBe('Test Board');
        });
    });

    it('should return 404 for non-existent board', () => {
      return request(app.getHttpServer()).get('/board/999').expect(404);
    });
  });

  describe('/board/:id (PATCH)', () => {
    it('should update a board', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/board')
        .send({
          title: 'Original Title',
          content: 'Original Content',
          author: 'Original Author',
        });

      const boardId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/board/${boardId}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(boardId);
          expect(res.body.title).toBe('Updated Title');
          expect(res.body.content).toBe('Updated Content');
          expect(res.body.author).toBe('Original Author');
        });
    });

    it('should allow partial updates', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/board')
        .send({
          title: 'Original Title',
          content: 'Original Content',
          author: 'Original Author',
        });

      const boardId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/board/${boardId}`)
        .send({
          title: 'Updated Title Only',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Title Only');
          expect(res.body.content).toBe('Original Content');
          expect(res.body.author).toBe('Original Author');
        });
    });

    it('should return 404 when updating non-existent board', () => {
      return request(app.getHttpServer())
        .patch('/board/999')
        .send({
          title: 'Updated Title',
        })
        .expect(404);
    });
  });

  describe('/board/:id (DELETE)', () => {
    it('should delete a board', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/board')
        .send({
          title: 'Test Board',
          content: 'Test Content',
          author: 'Test Author',
        });

      const boardId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/board/${boardId}`)
        .expect(200);

      return request(app.getHttpServer()).get(`/board/${boardId}`).expect(404);
    });

    it('should return 404 when deleting non-existent board', () => {
      return request(app.getHttpServer()).delete('/board/999').expect(404);
    });
  });
});
