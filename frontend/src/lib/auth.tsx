export const isAuthenticated = () => {
  return !!(localStorage.getItem('user') || sessionStorage.getItem('user'));
};

export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};
