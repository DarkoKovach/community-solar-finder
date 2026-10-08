import { format, parseISO, isValid } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

// Map of supported locales to date-fns locale objects
const LOCALE_MAP = {
    'en': enUS,
    'en-US': enUS,
    'es': es
};

/**
 * Format a date string into a human-readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Date format string (default: 'MMM d, yyyy')
 * @param {string} locale - Locale for date formatting (default: 'en-US')
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, formatStr = 'MMM d, yyyy', locale = 'en-US') => {
    if (!dateString) return '';

    try {
        const date = parseISO(dateString);

        if (!isValid(date)) {
            return '';
        }

        return format(date, formatStr, {
            locale: LOCALE_MAP[locale] || LOCALE_MAP['en-US']
        });
    } catch (error) {
        return '';
    }
};

/**
 * Format a number as percentage
 * @param {number|string} value - Value to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage
 */
export const formatPercent = (value, decimals = 0) => {
    if (value === undefined || value === null) return '0%';

    const numValue = parseFloat(value);

    if (isNaN(numValue)) return '0%';

    return `${numValue.toFixed(decimals)}%`;
};

/**
 * Format an address object into a string
 * @param {Object} address - Address object
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
    if (!address) return '';

    const parts = [
        address.street,
        address.street_two,
        `${address.city}, ${address.state} ${address.zip_code}`
    ].filter(Boolean);

    return parts.join(', ');
};