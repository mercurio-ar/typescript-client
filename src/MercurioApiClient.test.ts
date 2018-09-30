import { ISerie, IVisualization, Visualization } from "@mercurio-ar/model";
import { ISearchResult, MercurioApiClient, SearchQuery } from "./";


describe('MercurioApiClient', () => {

    const serie1DTO: ISerie | ISearchResult | any = { id: 1, displayName: 'serie01' };
    const visualization1DTO: IVisualization = { id: 1, name: 'serie01', series: [serie1DTO] };
    const visualization1: Visualization = Visualization.from(visualization1DTO);
    const searchResult1DTO: ISearchResult[] = [
        serie1DTO
    ];
    const visualizationsDTO: IVisualization[] = [
        visualization1DTO
    ];
    let http: any;
    let client: MercurioApiClient;

    beforeEach(() => {
        http = {
            delete: jest.fn().mockResolvedValue({}),
            get: jest.fn().mockResolvedValue({ data: searchResult1DTO }),
            post: jest.fn().mockResolvedValue({ data: visualization1DTO }),
        };
        client = new MercurioApiClient(http);
    });

    it('searchs', () => {
        // Setup
        const searchQuery = new SearchQuery('dolar');

        // Exercise
        const actualSearchResult = client.search(searchQuery);

        // Verify
        expect(http.get).toBeCalledWith('/series/search?searchTerm=dolar')
        expect(actualSearchResult).resolves.toBe(searchResult1DTO)
    });

    it('createVisualizationFromSearchResult', async () => {
        // Setup
        const searchQuery = new SearchQuery('dolar');

        // Exercise
        const actualSearchResult = await client.search(searchQuery)

        const actualVisualization = await client.createVisualizationFromSearchResult(actualSearchResult[0]);

        // Verify
        expect(http.post).toBeCalledWith('/visualizations', { searchResult: actualSearchResult[0] });
        expect(actualVisualization).toEqual(visualization1)
    });

    it('deleteVisualization', async () => {
        // Exercise
        await client.deleteVisualization(visualization1DTO);

        // Verify
        expect(http.delete).toBeCalledWith(`/visualizations/${visualization1DTO.id}`);
    });

    it('fetchVisualizations', async () => {
        // Setup
        http.get = jest.fn().mockResolvedValue({data: visualizationsDTO});

        // Exercise
        const actualVisualizations: IVisualization[] = await client.fetchVisualizations();

        // Verify
        expect(http.get).toBeCalledWith('/visualizations');
        expect(actualVisualizations).toEqual([visualization1]);
    });

    it('addSearchResultToVisualization returns modified visualization', async () => {
        // Setup
        const modifiedVisualization = jest.fn();
        http.put = jest.fn().mockResolvedValue({data: modifiedVisualization});

        // Exercise
        const actualModifiedVisualization = await client.addSearchResultToVisualization(visualization1DTO, searchResult1DTO[0]);
    
        // Verify
        expect(http.put).toBeCalledWith(`/visualizations/${visualization1DTO.id}`, {searchResult: searchResult1DTO[0]});
        expect(actualModifiedVisualization).not.toBe(visualization1DTO);
    });
});
