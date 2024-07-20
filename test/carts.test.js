import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js'; // Asegúrate de que esta ruta es correcta y que el archivo server.js es un módulo ES.

const { expect } = chai;

chai.use(chaiHttp);

describe('Carts API', () => {
  it('should add a product to the cart', (done) => {
    chai.request(app)
      .post('/api/carts/add-to-cart')
      .send({
        productId: 'someProductId',
        quantity: 2
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').eql('Producto agregado al carrito');
        done();
      });
  });

  it('should get a cart by id', (done) => {
    const cartId = 'someValidCartId';
    chai.request(app)
      .get(`/api/carts/${cartId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should finalize purchase and generate a ticket', (done) => {
    const cartId = 'someValidCartId';
    chai.request(app)
      .post(`/api/carts/${cartId}/purchase`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('code');
        done();
      });
  });
});
