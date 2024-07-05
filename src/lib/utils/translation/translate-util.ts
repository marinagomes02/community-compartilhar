import translation from "./translation";


export const translate = (locale: string, key: string) => translation[locale][key];

export const languageOptions = Object.keys(translation);