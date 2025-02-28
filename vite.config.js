export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    historyApiFallback: true,
    middlewareMode: true
  },
  publicDir: 'public' 
});
