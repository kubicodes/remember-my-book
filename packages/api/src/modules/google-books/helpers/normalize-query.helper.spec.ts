import { normalizeQuery } from "./normalize-query.helper";
describe("normalizeQuery", () => {
    it("transforms everything to lowercase", () => {
        const query = "hElLo";

        expect(normalizeQuery(query)).toBe("hello");
    });

    it("trims the words which are separated by a space", () => {
        const query = " hello world     ";
        expect(normalizeQuery(query)).toBe("hello world");
    });
});
