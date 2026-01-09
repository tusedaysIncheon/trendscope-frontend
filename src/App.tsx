import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider"
import AppLayout from "./components/layouts/AppLayout"
import AuthInitializer from "./components/auth/AuthInitializer" // 아까 만든 컴포넌트

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthInitializer>
          <AppLayout />
        </AuthInitializer>
      </BrowserRouter>
    </ThemeProvider>
  )
}