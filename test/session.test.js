import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Session Router", () => {
  it("redirectar a login", async () => {
    const response = await request(app).get("/api/sessions");
    expect(response.status).to.equal(302);
    expect(response.header["location"]).to.equal("/login");
  });

  it("logout y redirectar a login", async () => {
    const response = await request(app).get("/api/sessions/logout");
    expect(response.status).to.equal(302);
    expect(response.header["location"]).to.equal("/login");
  });

  it("retorna unauthorized tratando de acceder sin login", async () => {
    const response = await request(app).get("/api/sessions/admin");
    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ status: "ERR", message: "Usuario no autorizado" });
  });

  it("retorna unauthorized tratando de entrar a la pagina admin con user not-admin", async () => {
    const response = await request(app).get("/api/sessions/admin");
    
    expect(response.status).to.equal(401);
    
    expect(response.body).to.deep.equal({ status: "ERR", message: "Usuario no autorizado" });
  });
});
