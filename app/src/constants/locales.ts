const TTS_LANG_BY_UI_LANGUAGE: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  pl: "pl-PL",
  fr: "fr-FR",
  de: "de-DE",
  uk: "uk-UA",
};

export const getTtsLang = (): string => {
  const primarySubtag = chrome.i18n.getUILanguage().split("-")[0];
  return TTS_LANG_BY_UI_LANGUAGE[primarySubtag] ?? "en-US";
};
