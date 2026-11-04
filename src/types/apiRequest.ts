import { BASE_URL } from "../services/api/endpoints";
import type { ApiResponse } from "./apiResponse";

export async function API_REQUEST<T>(endpoint: string, options : RequestInit = {}) : Promise<ApiResponse<T>>{
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers:{
            "Content-Type": "application/json",
            ...options.headers,
        }
    });

    if(!response.ok)
    {
        throw new Error(`HTTP Error : ${response.status}`);
    }

    const result : ApiResponse<T> = await response.json();

    if(!result.isSuccess)
    {
        throw new Error(result.message || "Request failed.");
    }

    return result;
}