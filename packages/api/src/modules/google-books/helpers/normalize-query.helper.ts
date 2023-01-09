export function normalizeQuery(query: string): string {
    return query
        .toLowerCase()
        .split(" ")
        .map((word: string) => word.trim())
        .filter((word: string) => word !== "")
        .join(" ");
}
