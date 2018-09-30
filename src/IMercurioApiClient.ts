import { IVisualization } from '@mercurio-ar/model';
import { ISearchQuery } from './';


export interface ISearchResult {
    id: number;
    displayName: string;
}

export interface IMercurioApiClient {
    createVisualizationFromSearchResult: (searchResult: ISearchResult) => Promise<IVisualization>;
    deleteVisualization: (visualization: IVisualization) => Promise<void>;
    fetchVisualizations: () => Promise<IVisualization[]>
    search: (searchQuery: ISearchQuery) => Promise<ISearchResult[]>
    addSearchResultToVisualization: (visualization: IVisualization, searchResult: ISearchResult) => Promise<IVisualization>
}
