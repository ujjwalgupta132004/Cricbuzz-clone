import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();  
        setError('');
        try {
            await register(name, email, password);
            navigate('/');  
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" placeholder="Name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                <button type="submit"
                    className="bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition font-semibold">
                    Register
                </button>
            </form>
            <p className="text-center mt-4 text-sm">
                Already have an account? <Link to="/login" className="text-green-700 font-semibold">Login</Link>
            </p>
        </div>
    );
};
export default Register;
