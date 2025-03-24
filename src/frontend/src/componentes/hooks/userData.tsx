

const useUserData =  () => {
    const response = localStorage.getItem('user')
    return response ? JSON.parse(response) : null
};

export default useUserData;