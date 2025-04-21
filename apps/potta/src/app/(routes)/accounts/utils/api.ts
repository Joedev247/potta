
import axios from 'config/axios.config';

import { AxiosResponse } from 'axios';
import { accountPayload, accountUpdatePayload } from './validations';


export const accountsApi = {

    getOhada: async (name: string) => {


        const result = await axios.post(
            `/ohada-accounts/tree-by-name/${name}`
        );
        console.log(result);
        return result.data
    },
    SearchOhada: async (name: string, code: string | number) => {
        const cname = name

        const result = await axios.post(
            `/ohada-accounts/search?code=${code}&name=${cname}`
        );
        console.log(result);
        return result.data
    },
    create: async (data: accountPayload) => {
        const result = await axios.post(`/accounts/create`, data, {
        });
        return result?.data;
    },
    getAll: async (filter: Record<string, any> = {}) => {
        const queryParams = new URLSearchParams(filter).toString();

        const result = await axios.post(
            `/accounts/filter?${queryParams}`
        );
        console.log(result);
        return result.data
    },
    getOne: async (account_id: string) => {
        const result = await axios.get(`/accounts/details/${account_id}`);

        return result.data;
    },
    update: async (account_id: string, data: accountUpdatePayload) => {
        const result = await axios.put(`/accounts/${account_id}`, data, {
        });
        return result?.data;
    },
    delete: async (account_id: string) => {
        const result = await axios.delete(`/account/${account_id}`);
        return result?.data;
    },
}
