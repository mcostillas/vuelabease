import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://bfmvnahlknvyrajofmdw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbXZuYWhsa252eXJham9mbWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTc4NjUsImV4cCI6MjA2MDU3Mzg2NX0.xkeqAML3bYf9iOV6iG_GJ35_RD7rPKH_OuXFz1SQBLk')

// Get instructor profile
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
      .eq('UserID', userId)
      .single()

    if (error) {
      throw error
    }

    return { instructor, error: null }
  } catch (error) {
    console.error('Error fetching instructor profile:', error.message)
    return { instructor: null, error: error.message }
  }
}

// Get all instructors
export const getAllInstructors = async () => {
  try {
    const { data: instructors, error } = await supabase
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

    if (error) {
      throw error
    }

    return { instructors, error: null }
  } catch (error) {
    console.error('Error fetching instructors:', error.message)
    return { instructors: null, error: error.message }
  }
}

// Get instructors with pagination
export const getInstructorsWithPagination = async (page = 0, pageSize = 10) => {
  try {
    const from = page * pageSize
    const to = from + pageSize - 1

    const { data: instructors, error, count } = await supabase
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
      `, { count: 'exact' })
      .range(from, to)

    if (error) {
      throw error
    }

    return {
      instructors,
      totalCount: count,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      error: null
    }
  } catch (error) {
    console.error('Error fetching instructors:', error.message)
    return {
      instructors: null,
      totalCount: 0,
      currentPage: page,
      pageSize,
      totalPages: 0,
      error: error.message
    }
  }
}