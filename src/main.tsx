import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import characterPreloadUrl from '@/assets/Character.png?url'

// 스플래시 이미지 미리 로드 (첫 화면 노출 전에 요청 시작)
const preloadLink = document.createElement('link')
preloadLink.rel = 'preload'
preloadLink.as = 'image'
preloadLink.href = characterPreloadUrl
document.head.appendChild(preloadLink)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
