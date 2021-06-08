const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^#/(.*)$': '<rootDir>/test/unit/specs/$1',
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  // mapCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/pages/**/*.vue',
    'src/components/*.vue',
    'src/assets/js/*/*.js',
    '!**/node_modules/**',
    '!src/pages/propertySide/buildingDictionary/components/ImagePreviewDrag.vue'
  ],
  // 生成测试报告
  // reporters: [
  //   "default",
  //   ["./node_modules/jest-html-reporter", {
  //     "pageTitle": "Test Report",
  //     // 插件将输出HTML报告的路径。路径必须包含文件名，并以.html结尾
  //     // "outputPath": "public/jest-report.html"
  //   }]
  // ]
}
