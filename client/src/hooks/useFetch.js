import { useState, useEffect } from 'react';

const useFetch = (apiCallFn) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCallFn();
            setData(response.data);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;
