import { defineConfig } from 'vite';
import { angular } from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    historyApiFallback: true
  },
  optimizeDeps: {
    exclude: [
      '@angular/common',
      '@angular/common/http',
      '@angular/core',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/platform-browser/animations',
      '@angular/router',
      'rxjs',
      'socket.io-client'
    ]
  }
}); 