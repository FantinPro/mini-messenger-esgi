export default {
    server: {
        host: '0.0.0.0',
        port: 8001,
        hmr: {
            clientPort: 443
        },
    },
    build: {
        outDir: "../build/client",
        emptyOutDir: true
    }
}
