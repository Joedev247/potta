"use client"

import { ContextData } from "../../../contexts/verificationContext"
import { useContext } from "react"

const useVerificaton = () => {
	return useContext(ContextData)
}

export default useVerificaton