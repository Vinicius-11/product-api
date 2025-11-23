const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

let token = null;
let usuarioId = null;

afterAll(async () => {
  await mongoose.connection.collection("usuarios").deleteMany({});
  await mongoose.connection.close();
});

describe("TESTES DA API /usuarios", () => {

  beforeAll(async () => {
    await mongoose.connection.collection("usuarios").deleteMany({});

    const emailLogin = `usuario_login_${Date.now()}@teste.com`;
    const resp = await request(app)
      .post("/usuarios")
      .send({ email: emailLogin, senha: "12345678" })
      .expect(201);

    usuarioId = resp.body._id;

    const login = await request(app)
      .post("/usuarios/login")
      .send({ usuario: emailLogin, senha: "12345678" })
      .expect(200);

    token = login.body.token;
  });
  
  test("POST /usuarios → 422 sem email e senha", async () => {
    const resp = await request(app).post("/usuarios").send({});
    expect(resp.status).toBe(422);
    expect(resp.body.msg).toBe("Email e Senha são obrigatórios");
  });

  test("POST /usuarios → 201 criado com sucesso", async () => {
    const resp = await request(app)
      .post("/usuarios")
      .send({
        email: `novo_user_${Date.now()}@teste.com`,
        senha: "abcd1234"
      });
    expect(resp.status).toBe(201);
    expect(resp.body).toHaveProperty("_id");
    usuarioId = resp.body._id;
  });

  // -------------------------------
  // LOGIN
  // -------------------------------
  test("POST /usuarios/login → 401 email incorreto", async () => {
    await request(app)
      .post("/usuarios/login")
      .send({ usuario: "email_invalido@teste.com", senha: "abcd1234" })
      .expect(401);
  });

  test("POST /usuarios/login → 401 senha incorreta", async () => {
    await request(app)
      .post("/usuarios/login")
      .send({ usuario: `novo_user_${Date.now()}@teste.com`, senha: "errada" })
      .expect(401);
  });

  test("POST /usuarios/login → 200 sucesso", async () => {
    const resp = await request(app)
      .post("/usuarios/login")
      .send({ usuario: `novo_user_${Date.now()}@teste.com`, senha: "abcd1234" });
  });

  // -------------------------------
  // RENOVAR
  // -------------------------------
  test("POST /usuarios/renovar → 401 token ausente", async () => {
    await request(app).post("/usuarios/renovar").send({}).expect(401);
  });

  test("POST /usuarios/renovar → 200 válido", async () => {
    const resp = await request(app)
      .post("/usuarios/renovar")
      .set("authorization", `Bearer ${token}`)
      .send({});
    expect(resp.status).toBe(200);
    expect(resp.body.token).toBeDefined();
  });

  // -------------------------------
  // GET
  // -------------------------------
  test("GET /usuarios → 200 lista usuários", async () => {
    const resp = await request(app).get("/usuarios").set("authorization", `Bearer ${token}`);
    expect(resp.status).toBe(200);
    expect(Array.isArray(resp.body)).toBe(true);
  });

  test("GET /usuarios/:id → 400 id inválido", async () => {
    await request(app).get("/usuarios/123").set("authorization", `Bearer ${token}`).expect(400);
  });

  test("GET /usuarios/:id → 404 id não existe", async () => {
    await request(app)
      .get("/usuarios/000000000000000000000000")
      .set("authorization", `Bearer ${token}`)
      .expect(404);
  });

  test("GET /usuarios/:id → 401 token ausente", async () => {
    await request(app).get(`/usuarios/${usuarioId}`).expect(401);
  });

  test("GET /usuarios/:id → 200 sucesso", async () => {
    const resp = await request(app)
      .get(`/usuarios/${usuarioId}`)
      .set("authorization", `Bearer ${token}`);
    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty("_id", usuarioId);
  });

  // -------------------------------
  // PUT
  // -------------------------------
  test("PUT /usuarios/:id → 400 id inválido", async () => {
    await request(app)
      .put("/usuarios/0")
      .set("authorization", `Bearer ${token}`)
      .send({ email: "teste@teste.com", senha: "123456" })
      .expect(400);
  });

  test("PUT /usuarios/:id → 404 id não encontrado", async () => {
    await request(app)
      .put("/usuarios/000000000000000000000000")
      .set("authorization", `Bearer ${token}`)
      .send({ email: "teste@teste.com", senha: "123456" })
      .expect(404);
  });

  test("PUT /usuarios/:id → 401 token ausente", async () => {
    await request(app)
      .put(`/usuarios/${usuarioId}`)
      .send({ email: "teste@teste.com", senha: "123456" })
      .expect(401);
  });

  test("PUT /usuarios/:id → 200 sucesso", async () => {
    const resp = await request(app)
      .put(`/usuarios/${usuarioId}`)
      .set("authorization", `Bearer ${token}`)
      .send({ email: `atualizado_${Date.now()}@teste.com`, senha: "123456" });
    expect(resp.status).toBe(200);
  });

  // -------------------------------
  // DELETE
  // -------------------------------
  test("DELETE /usuarios/:id → 400 id inválido", async () => {
    await request(app).delete("/usuarios/0").set("authorization", `Bearer ${token}`).expect(400);
  });

  test("DELETE /usuarios/:id → 404 id não encontrado", async () => {
    await request(app)
      .delete("/usuarios/000000000000000000000000")
      .set("authorization", `Bearer ${token}`)
      .expect(404);
  });

  test("DELETE /usuarios/:id → 401 token ausente", async () => {
    await request(app).delete(`/usuarios/${usuarioId}`).expect(401);
  });

  test("DELETE /usuarios/:id → 204 sucesso", async () => {
    await request(app).delete(`/usuarios/${usuarioId}`).set("authorization", `Bearer ${token}`).expect(204);
  });

});
