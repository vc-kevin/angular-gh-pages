export const REGEX_CONSTANTS = {
  EMAIL_REGEX: /^[\p{L}0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[\p{L}0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[_\p{L}0-9][-_\p{L}0-9]*\.)*(?:[\p{L}0-9][-\p{L}0-9]{0,62})\.(?:(?:[a-z]{2}\.)?[a-z]{2,})$/iu,
  INTEGER_REGEX: /^[0-9]*$/,
  DECIMAL_REGEX: /^[0-9]*\.?[0-9]*$/
}

export enum messageType {
  info = 'info',
  error = 'error',
  warning = 'warning',
  success = 'success',
}

export const LANGUAGE_CONSTANTS = {
  en: 'en_US',
  de: 'de_CH',
}

export const DEFAULT_LANGUAGE = LANGUAGE_CONSTANTS.en;

export enum errorCode {
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  internalServer = 500,
}

export const COUNTRY_LIST = [
  { value: '63f3818f7ad52cc9f404f645', label: 'switzerland' },
  { value: '63f3818f7ad52cc9f404f5a7', label: 'austria' },
  { value: '63f3818f7ad52cc9f404f5de', label: 'germany' }
]

export const CURRENCY_LIST = [
  { value: 'CHF', label: 'CHF' },
  { value: 'EUR', label: 'EUR' }
]

export const LANGUAGE_LIST = [
  { value: 'en_US', label: 'English' },
  { value: 'de_CH', label: 'German' }
]

export const API_ROUTES = {
  cardCodeVerifyApi: 'cards/codeVerify',
  cardCodeRedeemApi: 'cards/markRedeem'
}

export enum cardCodeStatus {
  redeemed = 'redeemed',
  blocked = 'blocked',
  activated = 'activated',
  valid = 'valid'
}