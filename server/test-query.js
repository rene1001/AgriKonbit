const { query } = require('./config/database');
require('dotenv').config();

async function testQuery() {
  try {
    console.log('🔍 Testing database query...');
    
    // Test simple query
    const result = await query('SELECT 1 as test');
    console.log('✅ Database connection OK:', result);
    
    // Test projects query
    console.log('\n🔍 Testing projects query...');
    const projects = await query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.budget_gyt,
        CAST(p.images AS CHAR) as images
      FROM projects p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.status = 'validated'
      LIMIT 3
    `);
    
    console.log('✅ Projects found:', projects.length);
    if (projects.length > 0) {
      console.log('First project:', {
        id: projects[0].id,
        title: projects[0].title,
        images: projects[0].images
      });
    }
    
    // Test products query
    console.log('\n🔍 Testing products query...');
    const products = await query(`
      SELECT 
        p.id,
        p.name,
        p.price_usd,
        CAST(p.images AS CHAR) as images
      FROM products p
      WHERE p.is_active = true
      LIMIT 3
    `);
    
    console.log('✅ Products found:', products.length);
    if (products.length > 0) {
      console.log('First product:', {
        id: products[0].id,
        name: products[0].name,
        images: products[0].images
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testQuery();
