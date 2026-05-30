import { api } from "./client";

const getUser = async (userId: string) => {
    const response = await api.get(`/users/${userId}/`);

    return response.data;
}

export {
    getUser
}