import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import os from 'os'

// Utility to auto-detect host computer's LAN IPv4 address
function getLanIp() {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    if (!iface) continue
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && !alias.internal && alias.address !== '127.0.0.1') {
        return alias.address
      }
    }
  }
  return 'localhost'
}

const lanIp = getLanIp()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces for cross-device access
    port: 5173,
  },
  define: {
    __DEV_LAN_IP__: JSON.stringify(lanIp),
  }
})

