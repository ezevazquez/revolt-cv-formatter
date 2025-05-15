/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Employee } from "@/lib/types"

export default function CvTemplate({ employee, isPrint = false }: { employee: Employee; isPrint?: boolean }) {
  // Parse the raw JSON if it exists
  let data = employee
  if (employee.rawJson) {
    try {
      const parsedData = JSON.parse(employee.rawJson)
      // Merge the parsed data with the employee data, preferring the parsed data
      data = { ...employee, ...parsedData }
    } catch (error) {
      console.error("Error parsing employee JSON:", error)
    }
  }

  const containerClass = isPrint ? "p-8 font-sans max-w-[210mm] mx-auto bg-white" : "p-8 font-sans"

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-1">{data.fullName}</h1>
        <h2 className="text-2xl text-gray-700 mb-4">{data.role}</h2>

        <div className="text-gray-600">
          <p>revolt.digital</p>
          <p>{data.email}</p>
          <p>{data.linkedin}</p>
        </div>
      </div>

      {/* About Me */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold border-t-2 border-gray-300 pt-2 mb-3">SOBRE MÍ</h3>
        <p className="whitespace-pre-line">{data.aboutMe}</p>
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold border-t-2 border-gray-300 pt-2 mb-3">EXPERIENCIA</h3>
        {data.experience?.map((exp: any, index: number) => (
          <div key={index} className="mb-4">
            <h4 className="font-bold">
              {exp.company} - {exp.title}
            </h4>
            <p className="text-gray-600 mb-1">{exp.years}</p>
            <p className="whitespace-pre-line">{exp.summary}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold border-t-2 border-gray-300 pt-2 mb-3">EDUCACIÓN</h3>
        {data.education?.map((edu: any, index: number) => (
          <div key={index} className="mb-4">
            <h4 className="font-bold">{edu.degree}</h4>
            <p className="text-gray-600 mb-1">
              {edu.institution} - {edu.years}
            </p>
            <p className="whitespace-pre-line">{edu.summary}</p>
          </div>
        ))}
      </div>

      {/* Skills and Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills */}
        <div>
          <h3 className="text-xl font-semibold border-t-2 border-gray-300 pt-2 mb-3">HABILIDADES</h3>
          <ul className="list-none">
            {data.skills?.map((skill: string, index: number) => (
              <li key={index} className="mb-1">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Tools */}
        <div>
          <h3 className="text-xl font-semibold border-t-2 border-gray-300 pt-2 mb-3">HERRAMIENTAS</h3>
          <ul className="list-none">
            {data.tools?.map((tool: string, index: number) => (
              <li key={index} className="mb-1">
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
