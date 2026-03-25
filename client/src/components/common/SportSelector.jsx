import { useSport } from '../../context/SportsContext';

const SportSelector = () => {
    const { activeSport, setActiveSport, sports } = useSport();

    return (
        <div className="flex gap-3 mb-6">
            {sports.map(sport => (
                <button
                    key={sport.key}
                    onClick={() => setActiveSport(sport.key)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
            ${activeSport === sport.key
                            ? `bg-${sport.color}-600 text-white shadow-lg scale-105`
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                >
                    {sport.label}
                </button>
            ))}
        </div>
    );
};
export default SportSelector;
