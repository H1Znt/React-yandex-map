import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode> 
  // StrictMode строгий режим? включает дополнительные проверки и в режиме разработки выполняет 2 рендера компонента, только для useEffect и для useState. Это происходит только в режиме разработки, в проде такого не будет. После выгрузки, дублирования Panorama не будет
)
