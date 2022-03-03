const withTM = require('@vercel/examples-ui/transpile')();

/** @type {import('next').NextConfig} */
module.exports = withTM({
    reactStrictMode: true,
    images: {
        domains: [process.env.NEXT_PUBLIC_SERVER_DOMAIN],
    },
});
