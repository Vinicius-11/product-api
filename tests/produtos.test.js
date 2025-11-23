const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

let token = null;
let produtoId = null;

afterAll(async () => {
  await mongoose.connection.close();
});

describe("TESTES DA API /produtos", () => {

  beforeAll(async () => {
    await request(app)
      .post("/usuarios")
      .send({
        nome: "Produto User",
        email: "produtos@test.com",
        senha: "abcd1234"
      });

    const login = await request(app)
      .post("/usuarios/login")
      .send({
        usuario: "produtos@test.com",
        senha: "abcd1234"
      });

    token = login.body.token;
  });

  test("POST /produtos → deve criar um produto (201)", async () => {
    const resp = await request(app)
      .post("/produtos")
      .set("authorization", `Bearer ${token}`)
      .send({
        nome: "Caderno",
        preco: 25.5
      })
      .expect(201);

    expect(resp.body).toHaveProperty("_id");
    expect(resp.body.nome).toBe("Caderno");

    produtoId = resp.body._id;
  });

  test("GET /produtos → deve listar produtos (200)", async () => {
    const resp = await request(app)
      .get("/produtos")
      .expect(200);

    expect(resp.body).toBeInstanceOf(Array);
  });

  test("GET /produtos/:id → deve retornar produto específico (200)", async () => {
    const resp = await request(app)
      .get(`/produtos/${produtoId}`)
      .expect(200);

    expect(resp.body).toHaveProperty("_id", produtoId);
  });

  test("PUT /produtos/:id → deve atualizar um produto (200)", async () => {
    const resp = await request(app)
      .put(`/produtos/${produtoId}`)
      .set("authorization", `Bearer ${token}`)
      .send({
        nome: "Caderno Atualizado",
        preco: 30
      })
      .expect(200);

    expect(resp.body.nome).toBe("Caderno Atualizado");
  });

  test("DELETE /produtos/:id → deve remover produto (204)", async () => {
    await request(app)
      .delete(`/produtos/${produtoId}`)
      .set("authorization", `Bearer ${token}`)
      .expect(204);
  });

});
