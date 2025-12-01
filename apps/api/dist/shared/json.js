//server\src\utils\json.ts
// Utilidades para manejar JSON como string (compatible con SQLite)
export const stringToJson = (jsonString) => {
    if (!jsonString)
        return null;
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        console.error('Error parsing JSON string:', error);
        return null;
    }
};
export const jsonToString = (data) => {
    try {
        return JSON.stringify(data ?? {});
    }
    catch (error) {
        console.error('Error stringifying JSON:', error);
        return '{}';
    }
};
// Validar que un string sea JSON válido
export const isValidJson = (str) => {
    try {
        JSON.parse(str);
        return true;
    }
    catch {
        return false;
    }
};
