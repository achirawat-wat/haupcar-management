import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AntdApp } from 'antd'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0048b3',
          borderRadius: 8,
          colorBgContainer: '#ffffff',
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Card: {
            borderRadius: 12,
            boxShadowTertiary: '0 4px 12px rgba(0,0,0,0.05)'
          },
          Button: {
            borderRadius: 6,
            controlHeight: 40,
          }
        }
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
