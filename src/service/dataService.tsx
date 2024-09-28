
import {SearchResult} from '../types';

export const cjkSearch = async (drugAName: string, drugBName: string): Promise<SearchResult> => {
    return fetch(`http://127.0.0.1:8080/search/${drugAName}&${drugBName}`)
        .then(response => response.json())
        .then(data => data as SearchResult)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}
