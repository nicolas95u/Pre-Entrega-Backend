import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server'; // Ajusta esta ruta según tu estructura

const { expect } = chai;

chai.use(chaiHttp);

describe('Products API', () => {
  it('should get all products', (done) => {
    chai.request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a product', (done) => {
    chai.request(app)
      .post('/api/products')
      .send({
        title: 'Nuevo Producto',
        description: 'Descripción del producto',
        code: 'PRD123',
        price: 100,
        stock: 50,
        category: 'Categoría',
        thumbnails: ['img1.jpg', 'img2.jpg'],
        status: true
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').eql('Producto creado correctamente :)');
        done();
      });
  });

  it('should get a product by id', (done) => {
    const productId = 'someValidProductId';
    chai.request(app)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
