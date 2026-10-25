import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  async redirects() {
    return [
      { source: "/pricing", destination: "/precio", permanent: true },
      { source: "/precios", destination: "/precio", permanent: true },
      { source: "/terms", destination: "/terminos", permanent: true },
      { source: "/terminos-del-servicio", destination: "/terminos", permanent: true },
      { source: "/condiciones", destination: "/terminos", permanent: true },
      { source: "/privacy", destination: "/privacidad", permanent: true },
      { source: "/politica-de-privacidad", destination: "/privacidad", permanent: true },
      { source: "/refunds", destination: "/reembolsos", permanent: true },
      { source: "/refund-policy", destination: "/reembolsos", permanent: true },
      { source: "/reembolso", destination: "/reembolsos", permanent: true },
      { source: "/politica-de-reembolso", destination: "/reembolsos", permanent: true },
      { source: "/terms-of-service", destination: "/terminos", permanent: true },
      { source: "/privacy-notice", destination: "/privacidad", permanent: true },
    ];
  },
};

export default nextConfig;
