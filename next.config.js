module.exports = {
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }
    return config;
  },
  generateBuildId: () => "build",
  pageExtensions: ["mdx", "jsx", "js", "ts", "tsx"],
  compiler: {
    styledComponents: true,
  },
};
