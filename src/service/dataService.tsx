import {SearchResult} from '../types';

export const cjkSearch = async (drugAName: string, drugBName: string): Promise<SearchResult> => {
    return fetch(`http://127.0.0.1:8080/search/${drugAName}&${drugBName}`)
        .then(response => response.json())
        .then(data => data as SearchResult)
        .catch(error => {
            console.error('Error:', error);
            // throw error;
            throw new Error('数据库出现了一些故障，请稍后重试！');
        });
}
export const searchLLM = async (drugAName: string, drugBName: string | undefined): Promise<string> => {

    console.log(`http://127.0.0.1:8080/LLM/${drugAName}&${drugBName}`);
    try {
        const response = await fetch(`http://127.0.0.1:8080/LLM/${drugAName}&${drugBName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 假设后端返回的是纯文本
        return await response.text();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
