"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createEmployee } from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { emptyEmployeeTemplate, sampleEmployeeTemplate } from "@/lib/templates"

export default function AddEmployeePage() {
  const [fullName, setFullName] = useState("")
  const [jsonData, setJsonData] = useState(JSON.stringify(emptyEmployeeTemplate, null, 2))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate JSON
      const parsedJson = JSON.parse(jsonData)

      // Create employee
      await createEmployee({
        fullName: fullName || parsedJson.fullName,
        rawJson: jsonData,
      })

      toast({
        title: "Success",
        description: "Employee added successfully",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error adding employee:", error)
      toast({
        title: "Error",
        description: error instanceof SyntaxError ? "Invalid JSON format" : "Failed to add employee",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseTemplate = () => {
    setJsonData(JSON.stringify(emptyEmployeeTemplate, null, 2))
  }

  const handleUseSampleData = () => {
    setFullName(sampleEmployeeTemplate.fullName)
    setJsonData(JSON.stringify(sampleEmployeeTemplate, null, 2))
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Add New Employee</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>Enter the employee's full name and JSON data to create a new CV.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="fullName" className="mb-2 block">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter employee's full name"
              />
              <p className="text-sm text-muted-foreground mt-1">If left empty, the name from the JSON will be used.</p>
            </div>

            <Tabs defaultValue="editor">
              <TabsList className="mb-4">
                <TabsTrigger value="editor">JSON Editor</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="sample">Sample Data</TabsTrigger>
              </TabsList>

              <TabsContent value="editor">
                <div>
                  <Label htmlFor="jsonData" className="mb-2 block">
                    Employee JSON Data
                  </Label>
                  <Textarea
                    id="jsonData"
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="font-mono h-[500px]"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button type="button" variant="outline" onClick={handleUseTemplate}>
                      Use Empty Template
                    </Button>
                    <Button type="button" variant="outline" onClick={handleUseSampleData}>
                      Use Sample Data
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="template">
                <div className="border rounded-md p-4 bg-muted/50">
                  <pre className="text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(emptyEmployeeTemplate, null, 2)}
                  </pre>
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="button" onClick={handleUseTemplate}>
                    Use This Template
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sample">
                <div className="border rounded-md p-4 bg-muted/50">
                  <pre className="text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(sampleEmployeeTemplate, null, 2)}
                  </pre>
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="button" onClick={handleUseSampleData}>
                    Use Sample Data
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Employee"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
