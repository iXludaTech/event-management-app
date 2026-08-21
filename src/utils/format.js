export const formatDate = (isoString) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
        return isoString;
    }
    return date.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const toDateTimeLocal = (isoString) => {
    const date = isoString ? new Date(isoString) : new Date();
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const pad = (value) => String(value).padStart(2, '0');
    return [
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
        `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    ].join('T');
};

export const fromDateTimeLocal = (value) => (value ? new Date(value).toISOString() : '');

export const capitalize = (value) =>
    value.charAt(0).toUpperCase() + value.slice(1);
