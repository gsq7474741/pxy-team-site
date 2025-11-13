/**
 * i18n 配置文件
 * 定义支持的语言和默认语言
 */

export const locales = ['zh-CN', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh-CN';

/**
 * Locale 显示名称
 */
export const localeNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en': 'English',
};

/**
 * Locale 图标
 */
export const localeIcons: Record<Locale, string> = {
  'zh-CN': '🇨🇳',
  'en': '🇺🇸',
};
