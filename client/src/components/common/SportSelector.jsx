import { useSport } from '../../context/SportsContext';

const SportSelector = () => {
    const { activeSport, setActiveSport, sports } = useSport();

    return (
        <div className="sport-tabs">
            {sports.map(sport => (
                <button
                    key={sport.key}
                    onClick={() => setActiveSport(sport.key)}
                    className={`sport-tab ${activeSport === sport.key ? `active-${sport.key}` : ''}`}
                >
                    {sport.label}
                </button>
            ))}
        </div>
    );
};

export default SportSelector;
