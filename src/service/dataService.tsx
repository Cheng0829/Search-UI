import {BatchSearchResult, SearchResult} from '../types';

export const cjkSearch = async (drugAName: string, drugBName: string): Promise<SearchResult> => {
    return fetch(`https://5f4ddf95.r7.cpolar.top/search/${drugAName}&${drugBName}`)
        .then(response => response.json())
        .then(data => data as SearchResult)
        .catch(error => {
            console.error('Error:', error);
            // throw error;
            throw new Error('数据库出现了一些故障，请稍后重试！');
        });
}
export const batchCjkSearch = async (index: number, limit: number): Promise<BatchSearchResult> => {
    return fetch(`https://5f4ddf95.r7.cpolar.top/pageSearch/index=${index+1}&limit=${limit}`)
        .then(response => response.json())
        .then(data => data as BatchSearchResult)
        .catch(error => {
            console.error('Error:', error);
            // throw error;
            throw new Error('数据库出现了一些故障，请稍后重试！');
        });
}

export const notDDISearchLLM = async (drugAName: string, drugBName: string | undefined): Promise<string> => {
    // console.log(`https://5f4ddf95.r7.cpolar.top/LLM/${drugAName}&${drugBName}`);
    try {
        const response = await fetch(`https://5f4ddf95.r7.cpolar.top/LLM/DDI/No/${drugAName}&${drugBName}`, {
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

export const yesDDISearchLLM = async (drugAName: string, drugBName: string | undefined): Promise<string> => {
    // console.log(`https://5f4ddf95.r7.cpolar.top/LLM/${drugAName}&${drugBName}`);
    try {
        const response = await fetch(`https://5f4ddf95.r7.cpolar.top/LLM/DDI/Yes/${drugAName}&${drugBName}`, {
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
