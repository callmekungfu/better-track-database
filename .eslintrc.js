module.exports = {
    "extends": "airbnb",
    "env": {
        "browser": true,
        "node": true
    },    
    "globals": {
        "document": false
    },
    "rules": {
        "linebreak-style": ["error", "windows"],
        "no-unused-vars": ["warn"],
        "no-plusplus": "off",
        "react/jsx-indent": "off",
        "react/jsx-filename-extension": "off",
        "indent": "off",
        "max-len": "off",
        "no-return-assign": "off",
        "react/jsx-one-expression-per-line": "off",
        "react/prefer-stateless-function": "off",
        "react/destructuring-assignment": "off",
        "react/jsx-indent-props": "off",
        "react/prop-types": "warn",
        "comma-dangle": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "no-else-return": "off",
        "no-trailing-spaces": "warn",
        "consistent-return": "warn",
        "no-lonely-if": "off",
        "class-methods-use-this": "off"
    }
};