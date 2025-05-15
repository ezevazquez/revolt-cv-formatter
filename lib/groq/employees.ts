import { groq } from "next-sanity"

// Get all employees
export const getAllEmployeesQuery = groq`
  *[_type == "employee"] | order(fullName asc) {
    _id,
    fullName,
    role,
    lastUpdated
  }
`

// Get employee by ID
export const getEmployeeByIdQuery = groq`
  *[_type == "employee" && _id == $id][0] {
    _id,
    fullName,
    role,
    email,
    linkedin,
    aboutMe,
    experience,
    education,
    skills,
    tools,
    rawJson,
    lastUpdated
  }
`

// Search employees
export const searchEmployeesQuery = groq`
  *[_type == "employee" && (fullName match $searchTerm || role match $searchTerm)] | order(fullName asc) {
    _id,
    fullName,
    role,
    lastUpdated
  }
`

// Get employees by role
export const getEmployeesByRoleQuery = groq`
  *[_type == "employee" && role == $role] | order(fullName asc) {
    _id,
    fullName,
    role,
    lastUpdated
  }
`

// Get recent employees
export const getRecentEmployeesQuery = groq`
  *[_type == "employee"] | order(lastUpdated desc)[0...5] {
    _id,
    fullName,
    role,
    lastUpdated
  }
`
