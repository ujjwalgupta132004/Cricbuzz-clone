import { useParams } from 'react-router-dom';

const MatchDetail = () => {
    const { id } = useParams();
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">🏏 Match Detail</h2>
            <p>Viewing details for Match ID: {id}</p>
        </div>
    );
};
export default MatchDetail;
