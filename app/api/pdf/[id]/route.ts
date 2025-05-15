import { type NextRequest, NextResponse } from "next/server"
import { getEmployeeById } from "@/lib/api"
import puppeteer from "puppeteer"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const employee = await getEmployeeById(id)

    if (!employee) {
      return new NextResponse("Employee not found", { status: 404 })
    }

    // Get the base URL for the current environment
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const host = request.headers.get("host") || "localhost:3000"
    const baseUrl = `${protocol}://${host}`

    // Launch a headless browser
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // Navigate to the CV page
    await page.goto(`${baseUrl}/cv/${id}?print=true`, { waitUntil: "networkidle0" })

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    })

    await browser.close()

    // Return the PDF
    const fileName = `${employee.fullName.replace(/\s+/g, "_")}_CV.pdf`

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return new NextResponse("Error generating PDF", { status: 500 })
  }
}
