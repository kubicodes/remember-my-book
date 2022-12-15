import { GoogleBooksApiResponse, GoogleBooksItem, ResolvedGoogleBooksResponse } from "../schemas/google-books.schema";

export const name = "GoogleBooksResolver";

export interface IGoogleBooksResolver {
    resolveQueryResponse(response: GoogleBooksApiResponse, limit: number, offset: number): ResolvedGoogleBooksResponse;
    resolveItem(item: GoogleBooksItem): GoogleBooksItem;
}

export class GoogleBooksResolver implements IGoogleBooksResolver {
    public resolveQueryResponse(response: GoogleBooksApiResponse, limit: number, offset: number): ResolvedGoogleBooksResponse {
        return {
            count: response.items.length,
            limit,
            offset,
            items: response.items.map((item: GoogleBooksItem): GoogleBooksItem => this.resolveItem(item)),
        };
    }

    public resolveItem(item: GoogleBooksItem): GoogleBooksItem {
        return {
            id: item.id,
            volumeInfo: {
                title: item.volumeInfo.title,
                language: item.volumeInfo.language,
                ...(item.volumeInfo.subtitle ? { subtitle: item.volumeInfo.subtitle } : {}),
                ...(item.volumeInfo.description ? { description: item.volumeInfo.description } : {}),
                ...(item.volumeInfo.authors ? { authors: item.volumeInfo.authors } : {}),
                ...(item.volumeInfo.imageLinks ? { imageLinks: item.volumeInfo.imageLinks } : {}),
                ...(item.volumeInfo.pageCount ? { pageCount: item.volumeInfo.pageCount } : {}),
                ...(item.volumeInfo.publishedDate ? { publishedDate: item.volumeInfo.publishedDate } : {}),
            },
        };
    }
}
