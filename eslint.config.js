const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    { languageOptions: { globals: globals.node } },
    {
        rules: {
            "no-unused-vars": ["warn", { "varsIgnorePattern": "^_" }],
            "no-undef": "warn",
            "prefer-const": "warn",
            "semi": "warn"
        }
    }
];
