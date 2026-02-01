export interface IdeaFormData {
    projectName: string
    oneLine: string
    targetUser: string
    problem: string
    features: string[]
    platform: string
    competitor: string
    challenge: string
    deadline: string
}

export interface IdeaErrors {
    projectName: boolean
    oneLine: boolean
    targetUser: boolean
    problem: boolean
    features: boolean
    platform: boolean
    competitor: boolean
    challenge: boolean
    deadline: boolean
}