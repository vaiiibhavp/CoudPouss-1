export const formatTime = (ts: any) => {
    if (!ts) return "";
    if (typeof ts === "string") return ts;
    if (ts.toDate)
        return ts.toDate().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    return "";
};
export const formatDate = (
    date: string | Date,
    locale: string = "en-GB"
): string => {
    if (!date) return "";

    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const formatDisplayNumber = (
    value: number | string | bigint,
    showDecimals: boolean = true,
    decimalPoints: number = 2,
    locale: string = "en-US"
): string => {
    // Handle BigInt explicitly
    if (typeof value === "bigint") {
        return value.toLocaleString(locale);
    }

    const num = Number(value);

    // Invalid numbers
    if (!Number.isFinite(num)) return "0";

    // Avoid precision issues / unreadable values
    if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
        return num.toExponential(decimalPoints);
    }

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: showDecimals ? decimalPoints : 0,
        maximumFractionDigits: showDecimals ? decimalPoints : 0,
    }).format(num);
};
