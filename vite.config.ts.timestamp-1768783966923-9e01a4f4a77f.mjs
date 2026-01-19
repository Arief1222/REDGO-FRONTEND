// vite.config.ts
import { defineConfig } from "file:///D:/REDGO-AI/redgo-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/REDGO-AI/redgo-frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "file:///D:/REDGO-AI/redgo-frontend/node_modules/@svgr/rollup/dist/index.js";
var __vite_injected_original_dirname = "D:\\REDGO-AI\\redgo-frontend";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@/app": resolve(__vite_injected_original_dirname, "src/app"),
      "@/api": resolve(__vite_injected_original_dirname, "src/app/api"),
      "@/features": resolve(__vite_injected_original_dirname, "src/features"),
      "@/shared": resolve(__vite_injected_original_dirname, "src/shared"),
      "@/assets": resolve(__vite_injected_original_dirname, "src/assets"),
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-tsx",
          setup(build) {
            build.onLoad(
              { filter: /src\\.*\.js$/ },
              async (args) => ({
                loader: "tsx",
                contents: await fs.readFile(args.path, "utf8")
              })
            );
          }
        }
      ]
    }
  },
  // plugins: [react(),svgr({
  //   exportAsDefault: true
  // })],
  plugins: [svgr(), react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxSRURHTy1BSVxcXFxyZWRnby1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUkVER08tQUlcXFxccmVkZ28tZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1JFREdPLUFJL3JlZGdvLWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzL3Byb21pc2VzJztcclxuaW1wb3J0IHN2Z3IgZnJvbSAnQHN2Z3Ivcm9sbHVwJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgJ0AvYXBwJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvYXBwJyksXHJcbiAgICAgICAgICAgICdAL2FwaSc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2FwcC9hcGknKSxcclxuICAgICAgICAgICAgJ0AvZmVhdHVyZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9mZWF0dXJlcycpLFxyXG4gICAgICAgICAgICAnQC9zaGFyZWQnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9zaGFyZWQnKSxcclxuICAgICAgICAgICAgJ0AvYXNzZXRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvYXNzZXRzJyksXHJcbiAgICAgICAgICAgIHNyYzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGVzYnVpbGQ6IHtcclxuICAgICAgICBsb2FkZXI6ICd0c3gnLFxyXG4gICAgICAgIGluY2x1ZGU6IC9zcmNcXC8uKlxcLnRzeD8kLyxcclxuICAgICAgICBleGNsdWRlOiBbXSxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2xvYWQtanMtZmlsZXMtYXMtdHN4JyxcclxuICAgICAgICAgICAgICAgICAgICBzZXR1cChidWlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWlsZC5vbkxvYWQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGZpbHRlcjogL3NyY1xcXFwuKlxcLmpzJC8gfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jIChhcmdzKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlcjogJ3RzeCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudHM6IGF3YWl0IGZzLnJlYWRGaWxlKGFyZ3MucGF0aCwgJ3V0ZjgnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG5cclxuICAgIFxyXG4gICAgLy8gcGx1Z2luczogW3JlYWN0KCksc3Zncih7XHJcbiAgICAvLyAgIGV4cG9ydEFzRGVmYXVsdDogdHJ1ZVxyXG4gICAgLy8gfSldLFxyXG5cclxuICAgIHBsdWdpbnM6IFtzdmdyKCksIHJlYWN0KCldLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUSxTQUFTLG9CQUFvQjtBQUNuUyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxTQUFTLFFBQVEsa0NBQVcsU0FBUztBQUFBLE1BQ3JDLFNBQVMsUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDekMsY0FBYyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUMvQyxZQUFZLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQzNDLFlBQVksUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDM0MsS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNqQztBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFNBQVMsQ0FBQztBQUFBLEVBQ2Q7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNWLGdCQUFnQjtBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ0w7QUFBQSxVQUNJLE1BQU07QUFBQSxVQUNOLE1BQU0sT0FBTztBQUNULGtCQUFNO0FBQUEsY0FDRixFQUFFLFFBQVEsZUFBZTtBQUFBLGNBQ3pCLE9BQU8sVUFBVTtBQUFBLGdCQUNiLFFBQVE7QUFBQSxnQkFDUixVQUFVLE1BQU0sR0FBRyxTQUFTLEtBQUssTUFBTSxNQUFNO0FBQUEsY0FDakQ7QUFBQSxZQUNKO0FBQUEsVUFDSjtBQUFBLFFBQ0o7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVFBLFNBQVMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQzdCLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
