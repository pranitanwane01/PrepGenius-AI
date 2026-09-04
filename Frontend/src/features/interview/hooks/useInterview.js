// import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
// import { useContext, useEffect } from "react"
// import { InterviewContext } from "../interview.context"
// import { useParams } from "react-router"


// export const useInterview = () => {

//     const context = useContext(InterviewContext)
//     const { interviewId } = useParams()

//     if (!context) {
//         throw new Error("useInterview must be used within an InterviewProvider")
//     }

//     const { loading, setLoading, report, setReport, reports, setReports } = context

//     const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
//         setLoading(true)
//         let response = null
//         try {
//             response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
//             setReport(response.interviewReport)
//         } catch (error) {
//             console.log(error)
//         } finally {
//             setLoading(false)
//         }

//         return response.interviewReport
//     }

//     const getReportById = async (interviewId) => {
//         setLoading(true)
//         let response = null
//         try {
//             response = await getInterviewReportById(interviewId)
//             setReport(response.interviewReport)
//         } catch (error) {
//             console.log(error)
//         } finally {
//             setLoading(false)
//         }
//         return response.interviewReport
//     }

//     const getReports = async () => {
//         setLoading(true)
//         let response = null
//         try {
//             response = await getAllInterviewReports()
//             setReports(response.interviewReports)
//         } catch (error) {
//             console.log(error)
//         } finally {
//             setLoading(false)
//         }

//         return response.interviewReports
//     }

//     const getResumePdf = async (interviewReportId) => {
//         setLoading(true)
//         let response = null
//         try {
//             response = await generateResumePdf({ interviewReportId })
//             const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
//             const link = document.createElement("a")
//             link.href = url
//             link.setAttribute("download", `resume_${interviewReportId}.pdf`)
//             document.body.appendChild(link)
//             link.click()
//         }
//         catch (error) {
//             console.log(error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         if (interviewId) {
//             getReportById(interviewId)
//         } else {
//             getReports()
//         }
//     }, [ interviewId ])

//     return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

// }


import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
} from "../services/interview.api"

import {
    useContext,
    useEffect,
} from "react"

import { InterviewContext } from "../interview.context"

import { useParams } from "react-router"


export const useInterview = () => {

    const context =
        useContext(InterviewContext)

    const { interviewId } =
        useParams()


    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        )
    }


    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
    } = context


    // ─────────────────────────────────────────
    // Generate Interview Report
    // ─────────────────────────────────────────

    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile,
    }) => {

        setLoading(true)

        try {

            const response =
                await generateInterviewReport({
                    jobDescription,
                    selfDescription,
                    resumeFile,
                })

            setReport(
                response.interviewReport
            )

            return response.interviewReport

        } catch (error) {

            console.error(
                "Generate interview report error:",
                error
            )

            throw error

        } finally {

            setLoading(false)

        }
    }


    // ─────────────────────────────────────────
    // Get Single Interview Report
    // ─────────────────────────────────────────

    const getReportById = async (
        interviewId
    ) => {

        setLoading(true)

        try {

            const response =
                await getInterviewReportById(
                    interviewId
                )

            setReport(
                response.interviewReport
            )

            return response.interviewReport

        } catch (error) {

            console.error(
                "Get interview report error:",
                error
            )

            throw error

        } finally {

            setLoading(false)

        }
    }


    // ─────────────────────────────────────────
    // Get All Interview Reports
    // ─────────────────────────────────────────

    const getReports = async () => {

        setLoading(true)

        try {

            const response =
                await getAllInterviewReports()

            setReports(
                response.interviewReports
            )

            return response.interviewReports

        } catch (error) {

            console.error(
                "Get interview reports error:",
                error
            )

            throw error

        } finally {

            setLoading(false)

        }
    }


    // ─────────────────────────────────────────
    // Download Resume PDF
    // ─────────────────────────────────────────

    const getResumePdf = async (
        interviewReportId
    ) => {

        setLoading(true)

        try {

            console.log(
                "Requesting resume PDF..."
            )

            const response =
                await generateResumePdf({
                    interviewReportId,
                })

            if (!response) {
                throw new Error(
                    "PDF response was empty."
                )
            }

            console.log(
                "Resume PDF received successfully."
            )

            return response

        } catch (error) {

            console.error(
                "Resume PDF error:",
                error
            )

            throw error

        } finally {

            setLoading(false)

        }
    }


    // ─────────────────────────────────────────
    // Load Reports
    // ─────────────────────────────────────────

    useEffect(() => {

        if (interviewId) {

            getReportById(
                interviewId
            )

        } else {

            getReports()

        }

    }, [interviewId])


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf,
    }
}