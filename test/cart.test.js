import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import cartModel from "../src/dao/models/cart.model.js";


describe("Cart Router", () => {
  let cartId;

  before(async () => {
    const newCart = new Cart({
      products: ["657263d19a8125452cc19b33", "657263d19a8125452cc19b35"],
      total: 400,
    });
    const savedCart = await newCart.save();
    cartId = savedCart._id;
  });

  it("retorna todos los carritos con status 200", async () => {
    const response = await request(app)
      .get("/api/carts")
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(Array.isArray(response.body.carts)).to.be.true;
  });

  it("retorina un carrito por id", async () => {
    const carts = await cartModel.find();
    const cartId = carts[0]._id;
  
    const response = await request(app)
      .get(`/api/carts/${cartId}`)
      .expect(200)
      .expect("Content-Type", /json/);
  
    expect(response.body.payload).to.have.property("_id");
  });

});