import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import compression from 'vite-plugin-compression';


const MASTER_CLOUDFRONT_URL = 'https://d3247d8peb8l7u.cloudfront.net/'

const REWITE_ENDPOINTS = ['/auth', '/api', '/small', '/medium', '/organization-assets'];

const proxy = REWITE_ENDPOINTS.reduce((acc: any, endpoint: string) => {
  acc[endpoint] = MASTER_CLOUDFRONT_URL;
  return acc;
}, {});
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert(), compression()],

  server: {
    https: true,
    proxy,
  },

  // build: {
  //   rollupOptions: {
  //     /**
  //      * Ignore "use client" waning since we are not using SSR
  //      * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
  //      */
  //     onwarn(warning, warn) {
  //       if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) {
  //         return;
  //       }
  //       warn(warning);
  //     },
  //   },
  // },
});
