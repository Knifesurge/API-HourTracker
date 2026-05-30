import { api } from "./client";

const getHours = async (userId: string) => {
    const response = await api.get(`/hours/${userId}/`);

    return response.data;
}

export {
    getHours
}