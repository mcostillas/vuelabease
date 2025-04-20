// Script to create the email_queue table in Supabase
// Run this script once to set up the table structure

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  "https://bfmvnahlknvyrajofmdw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk"
);

// This function creates the email_queue table in Supabase
const createEmailQueueTable = async () => {
  try {
    // Check if the table already exists
    const { data: existingTables, error: listError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'email_queue');
    
    if (listError) {
      console.error('Error checking if table exists:', listError);
      return;
    }
    
    // If table already exists, don't recreate it
    if (existingTables && existingTables.length > 0) {
      console.log('email_queue table already exists');
      return;
    }
    
    // Create the email_queue table using SQL
    const { error } = await supabase.rpc('create_email_queue_table', {
      sql: `
        CREATE TABLE public.email_queue (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          recipient TEXT NOT NULL,
          subject TEXT NOT NULL,
          html_content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          sent_at TIMESTAMP WITH TIME ZONE,
          status TEXT NOT NULL DEFAULT 'pending',
          metadata JSONB,
          attempts INTEGER DEFAULT 0
        );
        
        -- Create index for faster queries
        CREATE INDEX email_queue_status_idx ON public.email_queue(status);
        CREATE INDEX email_queue_created_at_idx ON public.email_queue(created_at);
      `
    });
    
    if (error) {
      console.error('Error creating email_queue table:', error);
      return;
    }
    
    console.log('email_queue table created successfully');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Execute the function
createEmailQueueTable();
