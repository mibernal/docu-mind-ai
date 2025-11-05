// Utilidades para manejar JSON como string (compatible con SQLite)

export const stringToJson = <T>(jsonString: string | null): T | null => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON string:', error);
    return null;
  }
};

export const jsonToString = (data: any): string => {
  if (!data) return '{}';
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error stringifying JSON:', error);
    return '{}';
  }
};

// Validar que un string sea JSON válido
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};