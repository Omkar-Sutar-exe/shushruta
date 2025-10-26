/**
 * FIX SCRIPT - Product Hospital Email Synchronization
 * 
 * This script fixes any products where the hospital email (hemail) doesn't match
 * the email of the user who created the product.
 * 
 * This can happen if:
 * 1. Data was manually edited in the database
 * 2. User email was changed after product creation
 * 3. Products were created before the hospital email validation was added
 * 
 * Usage: node fix-product-emails.js [--dry-run]
 * 
 * Options:
 *   --dry-run    Show what would be fixed without making changes
 */

require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const userModel = require('./models/users');
const productModel = require('./models/products');

const DATABASE = process.env.DATABASE || 'mongodb://127.0.0.1:27017/Shushruta';
const isDryRun = process.argv.includes('--dry-run');

async function fixProductEmails() {
  try {
    // Connect to database
    await mongoose.connect(DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to database\n');

    if (isDryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made\n');
    } else {
      console.log('⚠️  LIVE MODE - Changes will be saved to database\n');
    }

    console.log('='.repeat(60));
    console.log('🔧 CHECKING PRODUCT HOSPITAL EMAILS');
    console.log('='.repeat(60));

    // Fetch all products with their creator user info
    const products = await productModel.find({}).populate('user', 'name email phoneNumber userType');
    
    console.log(`\nFound ${products.length} products in database\n`);

    let issuesFound = 0;
    let fixed = 0;

    for (const product of products) {
      if (!product.user) {
        console.log(`❌ Product "${product.pName}" (${product._id})`);
        console.log(`   Issue: No user reference found`);
        console.log(`   Current hemail: ${product.hemail}`);
        console.log(`   Action: Cannot fix - user reference missing\n`);
        issuesFound++;
        continue;
      }

      const creatorEmail = product.user.email;
      const currentHemail = product.hemail;
      const creatorName = product.user.name;
      const creatorPhone = product.user.phoneNumber;
      const creatorType = product.user.userType;

      // Check if creator is a hospital
      if (creatorType !== 'hospital') {
        console.log(`⚠️  Product "${product.pName}" (${product._id})`);
        console.log(`   Issue: Created by non-hospital user`);
        console.log(`   Creator: ${creatorEmail} (Type: ${creatorType})`);
        console.log(`   Current hemail: ${currentHemail}`);
        console.log(`   Action: This product should not exist - only hospitals can create products\n`);
        issuesFound++;
        continue;
      }

      // Check if hemail matches creator's email
      if (currentHemail !== creatorEmail) {
        console.log(`🔧 Product "${product.pName}" (${product._id})`);
        console.log(`   Issue: Hospital email mismatch`);
        console.log(`   Current hemail: ${currentHemail}`);
        console.log(`   Creator email: ${creatorEmail}`);
        console.log(`   Creator name: ${creatorName}`);
        console.log(`   Creator type: ${creatorType}`);
        
        if (!isDryRun) {
          // Update the product
          await productModel.updateOne(
            { _id: product._id },
            {
              $set: {
                hemail: creatorEmail,
                hname: creatorName,
                hphone: creatorPhone || product.hphone || ''
              }
            }
          );
          console.log(`   ✅ Fixed: Updated to ${creatorEmail}\n`);
          fixed++;
        } else {
          console.log(`   Would fix: Update to ${creatorEmail}\n`);
        }
        
        issuesFound++;
      }
    }

    console.log('='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total products checked: ${products.length}`);
    console.log(`Issues found: ${issuesFound}`);
    
    if (!isDryRun) {
      console.log(`Products fixed: ${fixed}`);
    } else {
      console.log(`Products that would be fixed: ${issuesFound}`);
      console.log(`\nTo apply fixes, run: node fix-product-emails.js`);
    }
    console.log('');

    // Additional check: Find products where hemail doesn't belong to any hospital user
    console.log('='.repeat(60));
    console.log('🔍 CHECKING FOR ORPHANED HOSPITAL EMAILS');
    console.log('='.repeat(60));

    const allHospitalEmails = await userModel.find({ userType: 'hospital' }).distinct('email');
    console.log(`\nFound ${allHospitalEmails.length} hospital users in database`);
    
    const orphanedProducts = [];
    for (const product of products) {
      if (!allHospitalEmails.includes(product.hemail)) {
        orphanedProducts.push(product);
      }
    }

    if (orphanedProducts.length > 0) {
      console.log(`\n⚠️  Found ${orphanedProducts.length} products with hospital emails not in system:\n`);
      orphanedProducts.forEach(p => {
        console.log(`   - "${p.pName}" has hemail: ${p.hemail}`);
        console.log(`     Created by: ${p.user ? p.user.email : 'Unknown'}`);
      });
      console.log('\n   These products reference hospitals that may not exist in the system.');
    } else {
      console.log('\n✅ All product hospital emails match existing hospital users');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the fix
fixProductEmails();

