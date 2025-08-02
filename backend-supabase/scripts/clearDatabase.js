const supabase = require('../config/supabase');

async function clearDatabase() {
  try {
    console.log('🗑️  Clearing alumni database...');
    
    // Delete all records from alumni table
    const { data, error } = await supabase
      .from('alumni')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records (using a condition that matches all)
    
    if (error) {
      console.error('❌ Error clearing database:', error);
      return;
    }
    
    console.log('✅ Database cleared successfully');
    console.log('📊 Records deleted:', data?.length || 'All records');
    
    // Verify the table is empty
    const { data: remainingData, error: countError } = await supabase
      .from('alumni')
      .select('id', { count: 'exact' });
    
    if (countError) {
      console.error('❌ Error checking remaining records:', countError);
    } else {
      console.log('📈 Remaining records:', remainingData?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
clearDatabase().then(() => {
  console.log('🏁 Database clearing completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
