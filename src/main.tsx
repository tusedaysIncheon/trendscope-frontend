import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryCilent = new QueryClient({
    defaultOptions:{
        queries : {
            retry: 0,
            refetchOnWindowFocus: false,
        },
    },
})

createRoot(document.getElementById('root')!).render(
 
    <QueryClientProvider client = {queryCilent}>

        <App />

        <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-right' />

    </QueryClientProvider>
   
 
)
