/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-libsql',
    '@libsql/client',
    '@libsql/hrana-client',
    'libsql',
  ],
};

export default nextConfig;
