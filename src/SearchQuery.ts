export interface ISearchQuery {
    searchTerm: string;
}

export class SearchQuery implements ISearchQuery {

    constructor(public searchTerm = ''){}
}
