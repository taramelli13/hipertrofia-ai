import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transformers.js (@xenova/transformers) usa binários nativos do onnxruntime;
  // mantê-lo fora do bundle do servidor evita problemas de empacotamento no deploy.
  serverExternalPackages: ["@xenova/transformers"],
};

export default nextConfig;
