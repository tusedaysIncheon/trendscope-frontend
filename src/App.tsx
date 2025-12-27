import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider"
import AppLayout from "./components/layouts/AppLayout"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect, useState } from "react";
import { axiosInstance } from "./lib/api/axiosInstance";

export default function App() {

  const { setAccessToken, setUser } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(()=>{
    const initAuth = async () => {
      try{
        const { data: tokenData } = await axiosInstance.post(
          "/jwt/refresh",
          {},
          { skipAuth : true}
        );

        const newAccessToken = tokenData.accessToken;
        setAccessToken(newAccessToken);

        const { data: userData } = await axiosInstance.get("/v1/user");
        setUser(userData);
        
        console.log("자동로그인 완료");
      } catch(error) {
        console.log("자동로그인실패/게스트모드");
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [setAccessToken, setUser]);

  if(isInitializing){

    return <div>Loading...</div>
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  )
}
