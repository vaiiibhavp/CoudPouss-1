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


