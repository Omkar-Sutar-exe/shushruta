/**
 * DEBUG SCRIPT - Email Flow Analyzer
 * 
 * This script helps diagnose email logic issues in organ request flow
 * 
 * Run this script to check:
 * 1. Which users exist in the database
 * 2. Which products exist and their hospital emails
 * 3. Who created which products
 * 
 * Usage: node debug-email-flow.js
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const userModel = require('./models/users');
const productModel = require('./models/products');
const orderModel = require('./models/orders');

const DATABASE = process.env.DATABASE || 'mongodb://127.0.0.1:27017/Shushruta';

async function analyzeEmailFlow() {
  try {
    // Connect to database
    await mongoose.connect(DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to database\n');

    // 1. Fetch all users
    console.log('='.repeat(60));
    console.log('📋 ALL USERS IN DATABASE');
    console.log('='.repeat(60));
    const users = await userModel.find({}).select('name email userType userRole');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Type: ${user.userType} (Role: ${user.userRole})`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });

    // 2. Fetch all products
    console.log('='.repeat(60));
    console.log('🏥 ALL PRODUCTS (ORGANS) IN DATABASE');
    console.log('='.repeat(60));
    const products = await productModel.find({}).populate('user', 'name email userType');
    
    if (products.length === 0) {
      console.log('⚠️  No products found in database\n');
    } else {
      products.forEach((product, index) => {
        console.log(`${index + 1}. Product: ${product.pName}`);
        console.log(`   Status: ${product.pStatus}`);
        console.log(`   Price: ${product.pPrice}`);
        console.log(`   Quantity: ${product.pQuantity}`);
        console.log(`   ---`);
        console.log(`   Hospital Name: ${product.hname}`);
        console.log(`   Hospital Email: ${product.hemail}`);
        console.log(`   Hospital Phone: ${product.hphone}`);
        console.log(`   ---`);
        console.log(`   Created By User: ${product.user ? product.user.name : 'Unknown'}`);
        console.log(`   Creator Email: ${product.user ? product.user.email : 'Unknown'}`);
        console.log(`   Creator Type: ${product.user ? product.user.userType : 'Unknown'}`);
        console.log(`   Product ID: ${product._id}`);
        console.log('');
      });
    }

    // 3. Fetch recent orders
    console.log('='.repeat(60));
    console.log('📦 RECENT ORDERS (Last 5)');
    console.log('='.repeat(60));
    const orders = await orderModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('allProduct.id', 'pName hemail hname');
    
    if (orders.length === 0) {
      console.log('⚠️  No orders found in database\n');
    } else {
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order._id}`);
        console.log(`   Patient: ${order.user ? order.user.name : 'Unknown'}`);
        console.log(`   Patient Email: ${order.user ? order.user.email : 'Unknown'}`);
        console.log(`   Amount: ${order.amount}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Transaction ID: ${order.transactionId}`);
        console.log(`   Products Ordered:`);
        order.allProduct.forEach((item, idx) => {
          if (item.id) {
            console.log(`     ${idx + 1}. ${item.id.pName}`);
            console.log(`        Hospital: ${item.id.hname}`);
            console.log(`        Hospital Email: ${item.id.hemail}`);
          }
        });
        console.log(`   Created: ${order.createdAt}`);
        console.log('');
      });
    }

    // 4. Email Flow Analysis
    console.log('='.repeat(60));
    console.log('🔍 EMAIL FLOW ANALYSIS');
    console.log('='.repeat(60));
    
    // Check for specific emails mentioned
    const email1 = 'itsofficialomkar@gmail.com';
    const email2 = 'omkarsutar.sae.comp@gmail.com';
    
    const user1 = await userModel.findOne({ email: email1 });
    const user2 = await userModel.findOne({ email: email2 });
    
    console.log(`\n🔎 Checking for: ${email1}`);
    if (user1) {
      console.log(`   ✅ Found: ${user1.name} (${user1.userType})`);
      const productsCreatedByUser1 = await productModel.find({ user: user1._id });
      console.log(`   Products created: ${productsCreatedByUser1.length}`);
      productsCreatedByUser1.forEach(p => {
        console.log(`     - ${p.pName} (Hospital Email: ${p.hemail})`);
      });
    } else {
      console.log(`   ❌ Not found in database`);
    }
    
    console.log(`\n🔎 Checking for: ${email2}`);
    if (user2) {
      console.log(`   ✅ Found: ${user2.name} (${user2.userType})`);
      const productsCreatedByUser2 = await productModel.find({ user: user2._id });
      console.log(`   Products created: ${productsCreatedByUser2.length}`);
      productsCreatedByUser2.forEach(p => {
        console.log(`     - ${p.pName} (Hospital Email: ${p.hemail})`);
      });
    } else {
      console.log(`   ❌ Not found in database`);
    }

    // 5. Check for products where hemail matches either email
    console.log('\n📧 Products with hospital email matching these addresses:');
    const productsWithEmail1 = await productModel.find({ hemail: email1 }).populate('user', 'name email');
    const productsWithEmail2 = await productModel.find({ hemail: email2 }).populate('user', 'name email');
    
    if (productsWithEmail1.length > 0) {
      console.log(`\n   Products with hemail = ${email1}:`);
      productsWithEmail1.forEach(p => {
        console.log(`     - ${p.pName} (Created by: ${p.user ? p.user.email : 'Unknown'})`);
      });
    }
    
    if (productsWithEmail2.length > 0) {
      console.log(`\n   Products with hemail = ${email2}:`);
      productsWithEmail2.forEach(p => {
        console.log(`     - ${p.pName} (Created by: ${p.user ? p.user.email : 'Unknown'})`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Analysis Complete');
    console.log('='.repeat(60));
    console.log('\n💡 INTERPRETATION:');
    console.log('   - If a PATIENT creates a product, they should NOT be able to');
    console.log('   - Only HOSPITAL users should create products');
    console.log('   - When a patient requests an organ, email goes to product.hemail');
    console.log('   - The product.hemail should be the hospital\'s email who created it');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the analysis
analyzeEmailFlow();

