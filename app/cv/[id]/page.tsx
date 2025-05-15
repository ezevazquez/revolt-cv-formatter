import { notFound } from "next/navigation"
import { getEmployeeById } from "@/lib/api"
import CvTemplate from "@/components/cv-template"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Download, Edit } from "lucide-react"

export default async function CvPage({
  params,
  searchParams,
}: { params: { id: string }; searchParams: { print?: string } }) {
  const employee = await getEmployeeById(params.id)
  const isPrint = searchParams.print === "true"

  if (!employee) {
    notFound()
  }

  // If it's print mode, only render the CV template
  if (isPrint) {
    return (
      <div className="print:p-0 p-4 bg-white min-h-screen">
        <CvTemplate employee={employee} isPrint={true} />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Employees
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/edit-employee/${params.id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit size={16} />
              Edit
            </Button>
          </Link>
          <Link href={`/api/pdf/${params.id}`} target="_blank">
            <Button className="flex items-center gap-2">
              <Download size={16} />
              Download PDF
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
        <CvTemplate employee={employee} />
      </div>
    </div>
  )
}
