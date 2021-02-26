module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    coverageDirectory: "./coverage/",
    collectCoverage: true,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    globals: {
        "ts-jest": {
            tsconfig: "__tests__/tsconfig.json",
        },
    },
};
