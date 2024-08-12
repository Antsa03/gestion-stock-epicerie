const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, "sql", "cjs", "mjs"],
    extraNodeModules: {
      ...defaultConfig.resolver.extraNodeModules,
      "@tanstack/react-query": require.resolve("@tanstack/react-query"),
    },
  },
};

module.exports = config;
