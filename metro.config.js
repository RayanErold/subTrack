// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for import.meta issues by enabling proper ESM resolution
config.resolver.sourceExts.push('mjs');

// Fix for import.meta issues in zustand
// Force resolution to the CJS entry point using resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web') {
        if (moduleName === 'zustand') {
            return {
                filePath: path.resolve(__dirname, 'node_modules/zustand/index.js'),
                type: 'sourceFile',
            };
        }
        if (moduleName.startsWith('zustand/')) {
            const subpath = moduleName.replace('zustand/', '');
            return {
                filePath: path.resolve(__dirname, `node_modules/zustand/${subpath}.js`),
                type: 'sourceFile',
            };
        }
    }
    return context.resolveRequest(context, moduleName, platform);
};

// Add aliases for web to fix Stripe and other native-only imports
if (!config.resolver.alias) {
    config.resolver.alias = {};
}

module.exports = config;
