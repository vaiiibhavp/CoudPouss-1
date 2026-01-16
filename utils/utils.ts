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