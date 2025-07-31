require('dotenv').config();
const supabase = require('./config/supabase');

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection by trying to query alumni table
    console.log('1. Testing connection to alumni table...');
    const { data, error } = await supabase
      .from('alumni')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection error:', error);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('📊 Current alumni count:', data.length);
    console.log('📋 Sample data:', data[0] || 'No data yet');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection(); 