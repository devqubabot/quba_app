const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

const vendorBoundaryPatterns = [
  "@supabase/*",
  "expo-sqlite",
  "expo-sqlite/*",
  "react-native-ble-plx",
  "react-native-ble-plx/*",
];

module.exports = defineConfig([
  globalIgnores([
    ".expo/**",
    "android/**",
    "coverage/**",
    "dist/**",
    "ios/**",
    "node_modules/**",
  ]),
  expoConfig,
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@expo/*",
                "expo",
                "expo-*",
                "react",
                "react/*",
                "react-native",
                "react-native/*",
                ...vendorBoundaryPatterns,
              ],
              message: "Domain code must stay framework and vendor agnostic.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}", "src/presentation/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: vendorBoundaryPatterns,
              message:
                "Presentation must call application contracts instead of infrastructure vendors.",
            },
          ],
        },
      ],
    },
  },
]);
