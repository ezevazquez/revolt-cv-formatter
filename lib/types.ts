export interface Experience {
    title: string
    company: string
    years: string
    summary: string
  }
  
  export interface Education {
    degree: string
    institution: string
    years: string
    summary: string
  }
  
  export interface Employee {
    _id: string
    fullName: string
    role: string
    email: string
    linkedin: string
    aboutMe: string
    experience: Experience[]
    education: Education[]
    skills: string[]
    tools: string[]
    rawJson?: string
    lastUpdated: string
  }
  