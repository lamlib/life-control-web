import { LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_USER_KEY } from "./main";

export function retriveUserPublicDataFromLocalStorage() {
    const userPublicDataJson = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if(userPublicDataJson) {
        return JSON.parse(userPublicDataJson);
    }
    return null;
}

export function deleteDataOnLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
}