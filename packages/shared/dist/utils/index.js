export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
