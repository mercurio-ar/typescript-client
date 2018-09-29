import { IVisualization } from '@mercurio-ar/model';

import { AxiosInstance } from 'axios';

import querystring from 'querystring';

import { IMercurioApi, ISearchQuery, ISearchResult } from './';


export class MercurioApi implements IMercurioApi {

    constructor(private http: AxiosInstance) { }

    public createVisualizationFromSearchResult(searchResult: ISearchResult): Promise<IVisualization> {
        return this.http.post(this.visualizationEndpoint(), {
            searchResult
        }).then(axiosResponse => axiosResponse.data);
    }

    public deleteVisualization(visualization: IVisualization): Promise<void> {
        return this.http.delete(this.visualizationEndpoint(), {
            data: {
                visualization
            }
        }).then(axiosResponse => axiosResponse.data);
    }

    public fetchVisualizations(): Promise<IVisualization[]> {
        return this.http.get(this.visualizationEndpoint())
            .then(axiosResponse => axiosResponse.data);
    }

    public search(searchQuery: ISearchQuery): Promise<ISearchResult[]> {
        const path = `${this.searchEndpoint()}?${querystring.stringify(searchQuery)}`;
        return this.http.get(path).then(axiosResponse => axiosResponse.data);
    }

    public addSearchResultToVisualization(visualization: IVisualization, searchResult: ISearchResult): Promise<IVisualization> {
        const path = this.visualizationEndpoint(visualization);
        return this.http.put(path, {
            searchResult
        }).then(axiosResponse => axiosResponse.data);
    }

    private visualizationEndpoint(visualization?: IVisualization) {
        let path = '/visualizations'
        if(visualization){
            path = `${path}/${visualization.id}`;
        }
        return path
    }

    private searchEndpoint() {
        return '/series/search'
    }
}
