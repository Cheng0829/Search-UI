
import {SearchResult} from '../types';
import {request} from "node:http";

// 一个异步请求函数，网址为www.baidu.com,返回结果为json键值对
// export const fetchData = async () => {
//     const response = await fetch('www.baidu.com');
//     if (!response.ok) {
//         throw new Error('Failed to fetch data');
//     }
//     return response.json();
// }

// 请求`http://127.0.0.1:8080/search/${drugAName}&{drugBName}`
export const cjkSearch = async (drugAName: string, drugBName: string): Promise<SearchResult> => {
    return fetch(`http://127.0.0.1:8080/search/${drugAName}&${drugBName}`)
        .then(response => response.json())
        .then(data => data as SearchResult)
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}
