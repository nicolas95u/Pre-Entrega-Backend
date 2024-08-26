import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Sessions API', () => {
  it('should register a user', (done) => {
    chai.request(app)
      .post('/session/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should login a user', (done) => {
    chai.request(app)
      .post('/session/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password'
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should logout a user', (done) => {
    chai.request(app)
      .get('/session/logout')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

export default app;
