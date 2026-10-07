/**
 * SWEETY COLOUR DECORA — SQLITE TO SUPABASE MIGRATION UTILITY
 * Usage:
 *   1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   2. Run: node migrate_to_supabase.js
 */

const { getDatabase } = require('./database');
const { getSupabaseClient } = require('./supabase_client');

async function migrate() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error('❌ Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment or .env.local file.');
    process.exit(1);
  }

  console.log('🚀 Starting SQLite to Supabase data migration...');
  const db = getDatabase();

  try {
    // 1. Projects
    const projects = db.prepare('SELECT * FROM projects').all();
    console.log(`📦 Found ${projects.length} projects in SQLite...`);
    if (projects.length > 0) {
      const { error: projErr } = await supabase.from('projects').upsert(projects, { onConflict: 'id' });
      if (projErr) console.warn('⚠️ Projects migration warning:', projErr.message);
      else console.log('✅ Projects migrated successfully.');
    }

    // 2. Workers
    const workers = db.prepare('SELECT * FROM workers').all();
    console.log(`👷 Found ${workers.length} workers in SQLite...`);
    if (workers.length > 0) {
      const { error: workErr } = await supabase.from('workers').upsert(workers, { onConflict: 'id' });
      if (workErr) console.warn('⚠️ Workers migration warning:', workErr.message);
      else console.log('✅ Workers migrated successfully.');
    }

    // 3. Attendance
    const attendance = db.prepare('SELECT * FROM attendance').all();
    console.log(`📋 Found ${attendance.length} attendance records in SQLite...`);
    if (attendance.length > 0) {
      const { error: attErr } = await supabase.from('attendance').upsert(attendance, { onConflict: 'id' });
      if (attErr) console.warn('⚠️ Attendance migration warning:', attErr.message);
      else console.log('✅ Attendance migrated successfully.');
    }

    // 4. Work Items
    const workItems = db.prepare('SELECT * FROM work_items').all();
    console.log(`📌 Found ${workItems.length} work items in SQLite...`);
    if (workItems.length > 0) {
      const { error: wiErr } = await supabase.from('work_items').upsert(workItems, { onConflict: 'id' });
      if (wiErr) console.warn('⚠️ Work items migration warning:', wiErr.message);
      else console.log('✅ Work items migrated successfully.');
    }

    // 5. Material Purchases
    const materials = db.prepare('SELECT * FROM material_purchases').all();
    console.log(`🧱 Found ${materials.length} material purchases in SQLite...`);
    if (materials.length > 0) {
      const { error: matErr } = await supabase.from('material_purchases').upsert(materials, { onConflict: 'id' });
      if (matErr) console.warn('⚠️ Material purchases migration warning:', matErr.message);
      else console.log('✅ Material purchases migrated successfully.');
    }

    console.log('🎉 Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  }
}

migrate();
