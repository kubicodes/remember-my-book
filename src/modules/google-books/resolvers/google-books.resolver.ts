import { GoogleBooksApiResponse, GoogleBooksItem, ResolvedGoogleBooksResponse } from "../schemas/google-books.schema";

export interface IGoogleBooksResolver {
    resolve(response: GoogleBooksApiResponse, limit: number, offset: number): ResolvedGoogleBooksResponse;
}

export class GoogleBooksResolver implements IGoogleBooksResolver {
    public resolve(response: GoogleBooksApiResponse, limit: number, offset: number): ResolvedGoogleBooksResponse {
        return {
            total: response.totalItems,
            count: response.items.length,
            limit,
            offset,
            items: response.items.map(
                (item: GoogleBooksItem): GoogleBooksItem => ({
                    id: item.id,
                    volumeInfo: {
                        title: item.volumeInfo.title,
                        subtitle: item.volumeInfo.subtitle,
                        description: item.volumeInfo.description,
                        authors: item.volumeInfo.authors,
                        imageLinks: item.volumeInfo.imageLinks,
                        language: item.volumeInfo.language,
                        pageCount: item.volumeInfo.pageCount,
                        publishedDate: item.volumeInfo.publishedDate,
                    },
                }),
            ),
        };
    }
}
