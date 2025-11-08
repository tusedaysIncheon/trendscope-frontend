import { useEffect} from "react"
import { BrowserRouter} from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider"
import { useAuthStore } from "@/store/useAuthStore"
import axios from "axios"
import AppLayout from "./components/layouts/AppLayout"

export default function App() {

  const { accessToken } = useAuthStore()

  useEffect(()=>{
    if(accessToken){
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
      console.log("access복원 완료")
    }
  },[accessToken])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  )
}
