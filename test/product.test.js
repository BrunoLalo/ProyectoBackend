import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import productModel from "../src/dao/models/product.model.js";

describe("Product Router", () => {
  let productId;

  before(async () => {
    const newProduct = new productModel({
      title: "Prueba",
      description: "Esto es una prueba",
      price: 100,
      thumbnail: "imagen de prueba",
      code: "prueba1",
      stock: 10,
    });
    const savedProduct = await newProduct.save();
    productId = savedProduct._id;
  });

  it("retorna los productos conn status 200", async () => {
    const response = await request(app)
      .get("/api/products")
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(response.body.status).to.equal("OK"); 
    expect(response.body.data).to.be.an("array"); 
  });

  it("retorna un producto por id", async () => {
    const response = await request(app)
      .get(`/api/products/${productId}`)
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(response.body.status).to.equal("OK"); 
    expect(response.body.data).to.have.property("_id"); 
    expect(response.body.data).to.have.property("title");
    expect(response.body.data).to.have.property("price");
  });

});