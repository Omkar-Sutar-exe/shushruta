const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const productModel = require("./models/products");
const userModel = require("./models/users");
const orderModel = require("./models/orders");

async function runDiagnostics() {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE || "mongodb://127.0.0.1:27017/Shushruta", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected");

    // Check products
    console.log("\n📦 CHECKING PRODUCTS:");
    const products = await productModel.find().limit(5);
    console.log(`Found ${products.length} products`);
    
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log("\nFirst product details:");
      console.log("- pName:", firstProduct.pName);
      console.log("- hemail:", firstProduct.hemail);
      console.log("- hname:", firstProduct.hname);
      console.log("- hphone:", firstProduct.hphone);
      
      if (!firstProduct.hemail) {
        console.log("⚠️  WARNING: hemail is missing!");
      }
      if (!firstProduct.hname) {
        console.log("⚠️  WARNING: hname is missing!");
      }
      if (!firstProduct.hphone) {
        console.log("⚠️  WARNING: hphone is missing!");
      }
    }

    // Check users
    console.log("\n👥 CHECKING USERS:");
    const users = await userModel.find().limit(5);
    console.log(`Found ${users.length} users`);
    
    if (users.length > 0) {
      const firstUser = users[0];
      console.log("\nFirst user details:");
      console.log("- name:", firstUser.name);
      console.log("- email:", firstUser.email);
      console.log("- phoneNumber:", firstUser.phoneNumber);
    }

    // Check orders
    console.log("\n📋 CHECKING ORDERS:");
    const orders = await orderModel.find().limit(5);
    console.log(`Found ${orders.length} orders`);
    
    if (orders.length > 0) {
      const lastOrder = orders[0];
      console.log("\nLatest order details:");
      console.log("- Order ID:", lastOrder._id);
      console.log("- User ID:", lastOrder.user);
      console.log("- Amount:", lastOrder.amount);
      console.log("- Address:", lastOrder.address);
      console.log("- Phone:", lastOrder.phone);
      console.log("- Products:", lastOrder.allProduct.length);
    }

    console.log("\n✅ Diagnostic complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

runDiagnostics();

