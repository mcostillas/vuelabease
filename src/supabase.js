import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper functions to match the Frontend implementation
export const getInstructorProfile = async (userId) => {
  try {
    const { data: instructor, error } = await supabase
      .from('instructor')
      .select(`
        InstructorID,
        Department,
        Position,
        Specialization,
        EmployeeID,
        user (
          FullName,
          Email,
          ContactNumber,
          UserType,
          IsActive
        )
      `)
      .eq('InstructorID', userId)
      .single();

    if (error) throw error;
    return instructor;
  } catch (error) {
    console.error('Error getting instructor profile:', error.message);
    return null;
  }
};
