module.exports = {
  'parserOptions': {
    "project": ["./tsconfig.json"],
    "ecmaVersion": "ES2021",
    "sourceType": "module",
    "tsconfigRootDir": __dirname,
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "tsx": true,
    }
  },
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": [
    "plugin:react/recommended",
    "standard-with-typescript",
  ],
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "plugins": [
    "react",
    "react-hooks",
    "eslint-plugin-react",
    "@typescript-eslint",
    "@stylistic",
    "@stylistic/js",
    "@stylistic/eslint-plugin-ts",
    "@stylistic/jsx",
    "@stylistic/eslint-plugin-plus",
    '@stylistic/ts'
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "quotes": "off",
    // укзываем расширение файлов?
    "import/extensions": [
      "error",
      {
        "ts": "never",
        "tsx": "never"
      }
    ],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error", {
      ignoreTypeValueShadow: true,
      ignoreFunctionTypeParameterNameValueShadow: true
    }],
    "@typescript-eslint/space-before-function-paren": "off",
    // пробел перед скобкой именованной, анонимной футнкции и прочее
    "@stylistic/space-before-function-paren": ["error", "never"],

    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/semi": "off",
    "@stylistic/semi": ["error", "always", { "omitLastInOneLineBlock": false }],
    "semi-spacing": ["error", { "before": false, "after": true }],
    "@stylistic/semi-style": ["error", "last"],
    "@typescript-eslint/semi": "off",
    "react/display-name": "off",
    "indent": "off",
    // "@typescript-eslint/indent": ["error", 2],
    '@stylistic/ts/indent': ['error', 2],
    "@typescript-eslint/no-explicit-any": ["error", { fixToUnknown: false, ignoreRestArgs: true }],
    "@typescript-eslint/no-var-requires": "off",
    // ключевое слово при импорте
    "@typescript-eslint/consistent-type-imports": "off",
    // if else for, while, &&, || and ?:
    "@typescript-eslint/no-unnecessary-condition": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/await-thenable": "off",
    // Запретить использование неиспользуемых переменных
    "@typescript-eslint/no-unused-vars": "off",
    // "no-extraneous-dependencies": "off", //
    // Запретить присваивание значений с типом any переменным и свойствам.
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off", // Запретить вызов значения с типом any.
    "@stylistic/ts/member-delimiter-style": [ // TypeScript - три разделителя между элементами в интерфейсах и псевдонимах типов
      "error", {
        "multiline": {
          "delimiter": "none", // ' ' ',' ';'
          "requireLast": false // последняя строка
        }
      }
    ],
    "default-param-last": "off",
    "@typescript-eslint/default-param-last": "off",

    "@typescript-eslint/prefer-nullish-coalescing": "off", //["error", { ignoreTernaryTests: true }]


  },
  "ignorePatterns": [
    "webpack.config.js",
    "postcss.config.js",
    "/*eslintrc.js",
    "/src/index.ts",
    "babel.config.js",
    "dist/",
    "src/**/interfaces.ts",
    "src/index.ts",
    "src/frontend/index.*"

  ]

}
