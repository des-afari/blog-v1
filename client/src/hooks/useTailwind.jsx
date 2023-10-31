import { useContext } from "react";
import TailwindContext from "../context/TailwindProvider"

const useAuth = () => {
    return useContext(TailwindContext)
}

export default useAuth