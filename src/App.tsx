import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import IndexPage from "./pages/index/IndexPage";
import SignUpPage from "./pages/auth/SignUpPage.tsx";

import { ModeToggle } from "./components/theme/mod-toggle";
import { ThemeProvider } from "./components/theme/theme-provider";
import LoginPage from "./pages/auth/LoginPage";


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
      <div>
      <ModeToggle />
      </div>


      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={ <LoginPage />} />
      </Routes>
      </BrowserRouter>
    </ThemeProvider> 
  );
}

export default App;
