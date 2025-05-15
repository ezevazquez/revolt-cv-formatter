import { client } from "@/sanity/lib/client"
import type { Employee } from "./types"
import {
  getAllEmployeesQuery,
  getEmployeeByIdQuery,
  searchEmployeesQuery,
  getEmployeesByRoleQuery,
} from "./groq/employees"

// Get all employees
export async function getEmployees() {
  return client.fetch(getAllEmployeesQuery)
}

// Get employee by ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
  return client.fetch(getEmployeeByIdQuery, { id })
}

// Search employees
export async function searchEmployees(searchTerm: string, role = "") {
  if (!searchTerm && !role) {
    return getEmployees()
  }

  if (role && !searchTerm) {
    return client.fetch(getEmployeesByRoleQuery, { role })
  }

  return client.fetch(searchEmployeesQuery, { searchTerm: `*${searchTerm}*` }).then((results) => {
    if (role) {
      return results.filter((emp: any) => emp.role === role)
    }
    return results
  })
}

// Create new employee
export async function createEmployee(data: { fullName: string; rawJson: string }) {
  try {
    // Parse the JSON to extract data
    const parsedData = JSON.parse(data.rawJson)

    // Create the employee document
    return client.create({
      _type: "employee",
      fullName: data.fullName || parsedData.fullName,
      role: parsedData.role || "",
      email: parsedData.email || "",
      linkedin: parsedData.linkedin || "",
      aboutMe: parsedData.aboutMe || "",
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      skills: parsedData.skills || [],
      tools: parsedData.tools || [],
      rawJson: data.rawJson,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error creating employee:", error)
    throw error
  }
}

// Update employee
export async function updateEmployee(id: string, data: Partial<Employee>) {
  try {
    // If rawJson is provided, parse it to update other fields
    if (data.rawJson) {
      const parsedData = JSON.parse(data.rawJson)

      return client
        .patch(id)
        .set({
          fullName: data.fullName || parsedData.fullName,
          role: parsedData.role || "",
          email: parsedData.email || "",
          linkedin: parsedData.linkedin || "",
          aboutMe: parsedData.aboutMe || "",
          experience: parsedData.experience || [],
          education: parsedData.education || [],
          skills: parsedData.skills || [],
          tools: parsedData.tools || [],
          rawJson: data.rawJson,
          lastUpdated: new Date().toISOString(),
        })
        .commit()
    }

    // Otherwise just update the provided fields
    return client
      .patch(id)
      .set({
        ...data,
        lastUpdated: new Date().toISOString(),
      })
      .commit()
  } catch (error) {
    console.error("Error updating employee:", error)
    throw error
  }
}

// Delete employee
export async function deleteEmployee(id: string) {
  return client.delete(id)
}
