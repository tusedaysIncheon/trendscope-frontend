import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import IndexPage from "./pages/index/IndexPage";
import SignUpPage from "./pages/auth/SignUpPage.tsx";

import { ModeToggle } from "./components/theme/mod-toggle";
import { ThemeProvider } from "./components/theme/theme-provider";
import LoginPage from "./pages/auth/LoginPage";
import { Toaster } from "sonner";
import CookiePage from "./pages/cookie/CookiePage.tsx";
import NicknamePage from "./pages/auth/NicknamePage.tsx";


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
      <header className="fixed  w-full h-[60px] flex justify-between bg-background items-center border-b">
        <div className="text-3xl font-bold p-4">Vote</div>
      <div className="p-4"><ModeToggle /></div>
      </header>


      <main className="pt-[60px]">
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={ <LoginPage />} />
        <Route path="/cookie" element={ <CookiePage />} />
        <Route path="/nickname" element={ <NicknamePage/>} />
      </Routes>
      </main>
      <Toaster richColors position="top-center" />
      </BrowserRouter>
    </ThemeProvider> 
  );
}

export default App;
