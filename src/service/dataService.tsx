import {BatchSearchResult, SearchResult} from '../types';

export const cjkSearch = async (drugAName: string, drugBName: string): Promise<SearchResult> => {
    // http://127.0.0.1:8080/search/${drugAName}&${drugBName}
    // https://5f4ddf95.r7.cpolar.top/search/${drugAName}&${drugBName}
    return fetch(`http://127.0.0.1:8080/search/${drugAName}&${drugBName}`)
        .then(response => response.json())
        .then(data => data as SearchResult)
        .catch(error => {
            console.error('Error:', error);
            // throw error;
            throw new Error('数据库出现了一些故障，请稍后重试！');
        });
}
export const batchCjkSearch = async (index: number, limit: number): Promise<BatchSearchResult> => {
    // http://127.0.0.1:8080/pageSearch/index=${index+1}&limit=${limit}
    // https://5f4ddf95.r7.cpolar.top/pageSearch/index=${index+1}&limit=${limit}
    return fetch(`http://127.0.0.1:8080/pageSearch/index=${index+1}&limit=${limit}`)
        .then(response => response.json())
        .then(data => data as BatchSearchResult)
        .catch(error => {
            console.error('Error:', error);
            // throw error;
            throw new Error('数据库出现了一些故障，请稍后重试！');
        });
}

export const yesDDISearchLLM = async (drugAName: string, drugBName: string | undefined, description: string): Promise<string> => {
    const url = `http://127.0.0.1:8290/llm?drugA=${drugAName}&&drugB=${drugBName}&type=1&description=${description}`.replace(/ /g, '%20');;
    console.log(url);
    // http://127.0.0.1:8080/LLM/DDI/Yes/${drugAName}&${drugBName}
    // https://5f4ddf95.r7.cpolar.top/LLM/DDI/Yes/${drugAName}&${drugBName}
    try {
        // http://127.0.0.1:829/llm?drugA=${drugAName}&&drugB=${drugBName}&type=1&description=${description}
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // if (!response.ok) {
        //     return "服务器维护中，请稍后再试~";
        //     // throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // 假设后端返回的是纯文本
        return await response.text();
    } catch (error) {
        // console.error('Fetch error:', error);
        return "服务器维护中，请稍后再试~";
        // console.error('Fetch error:', error);
        // if (error instanceof TypeError && error.message === "Failed to fetch") {
        //     throw new Error("Network error: Unable to connect to the server. Please check your internet connection and try again.");
        // } else if (error instanceof Error) {
        //     throw new Error(`An error occurred: ${error.message}`);
        // } else {
        //     throw new Error("An unknown error occurred");
        // }
    }
}

export const notDDISearchLLM = async (drugAName: string, drugBName: string | undefined ): Promise<string> => {
    const url = `http://127.0.0.1:8290/llm?drugA=${drugAName}&&drugB=${drugBName}&type=2`.replace(/ /g, '%20');
    console.log(url);
    // http://127.0.0.1:8080/LLM/DDI/No/${drugAName}&${drugBName}
    // https://5f4ddf95.r7.cpolar.top/LLM/DDI/No/${drugAName}&${drugBName}
    try {
        // http://127.0.0.1:829/llm?drugA=Trioxsalen&drugB=Verteporfin&type=1&ddi=description
        // http://127.0.0.1:829/llm?drugA=${drugAName}&&drugB=${drugBName}&type=2
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        // if (!response.ok) {
        //     return "服务器维护中，请稍后再试~";
        //     // throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // 假设后端返回的是纯文本
        return await response.text();
    } catch (error) {
        // console.error('Fetch error:', error);
        return "服务器维护中，请稍后再试~";
        // if (error instanceof TypeError && error.message === "Failed to fetch") {
        //     throw new Error("Network error: Unable to connect to the server. Please check your internet connection and try again.");
        // } else if (error instanceof Error) {
        //     throw new Error(`An error occurred: ${error.message}`);
        // } else {
        //     throw new Error("An unknown error occurred");
        // }
    }
}

export const loginVerify = async (username: string, password: string): Promise<string> => {
    // if (username === "root" && password === "123456")
    //     return "yes";
    // else
    //     return "no";
    // http://127.0.0.1:8080/loginVerify/${username}&${password}
    // https://5f4ddf95.r7.cpolar.top/loginVerify/${username}&${password}
    try {
        const response = await fetch(`http://127.0.0.1:8080/loginVerify/${username}&${password}`, {
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
};