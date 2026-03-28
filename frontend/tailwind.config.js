/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "m-3white": "var(--m-3white)",
        "m3-schemes-on-surface": "var(--m3-schemes-on-surface)",
        "m3-schemes-on-surface-variant": "var(--m3-schemes-on-surface-variant)",
        "m3-schemes-outline": "var(--m3-schemes-outline)",
        "m3-schemes-secondary": "var(--m3-schemes-secondary)",
        "m3-schemes-surface-container-lowest":
          "var(--m3-schemes-surface-container-lowest)",
        "variable-collection-background-1":
          "var(--variable-collection-background-1)",
        "variable-collection-background-blue":
          "var(--variable-collection-background-blue)",
        "variable-collection-background-green":
          "var(--variable-collection-background-green)",
        "variable-collection-background-lightblue":
          "var(--variable-collection-background-lightblue)",
        "variable-collection-button-blue":
          "var(--variable-collection-button-blue)",
        "variable-collection-button-tab":
          "var(--variable-collection-button-tab)",
        "variable-collection-checkmark-blue":
          "var(--variable-collection-checkmark-blue)",
        "variable-collection-priority-green":
          "var(--variable-collection-priority-green)",
        "variable-collection-priority-orange":
          "var(--variable-collection-priority-orange)",
        "variable-collection-priority-red":
          "var(--variable-collection-priority-red)",
        "variable-collection-text-color":
          "var(--variable-collection-text-color)",
      },
      fontFamily: {
        "body-regular": "var(--body-regular-font-family)",
        "m3-body-large": "var(--m3-body-large-font-family)",
        "m3-headline-small": "var(--m3-headline-small-font-family)",
        "m3-label-large": "var(--m3-label-large-font-family)",
        "m3-label-medium": "var(--m3-label-medium-font-family)",
        "m3-title-large": "var(--m3-title-large-font-family)",
        "m3-title-medium": "var(--m3-title-medium-font-family)",
        "single-line-body-base": "var(--single-line-body-base-font-family)",
      },
    },
  },
  plugins: [],
};
