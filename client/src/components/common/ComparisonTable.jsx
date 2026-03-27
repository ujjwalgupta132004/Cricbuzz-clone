const ComparisonTable = ({ player1, player2, stats }) => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
                <h3 className="font-bold text-green-700">{player1.name}</h3>
                <h3 className="font-bold text-gray-500">VS</h3>
                <h3 className="font-bold text-blue-700">{player2.name}</h3>
                {stats.map(stat => {
                    const val1 = player1[stat.key] || 0;
                    const val2 = player2[stat.key] || 0;
                    const isP1Better = val1 > val2;

                    return (
                        <>
                            <p className={`text-xl ${isP1Better ? 'font-bold text-green-600' : ''}`}>
                                {val1}
                            </p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className={`text-xl ${!isP1Better ? 'font-bold text-blue-600' : ''}`}>
                                {val2}
                            </p>
                        </>
                    );
                })}
            </div>
        </div>
    );
};
export default ComparisonTable;
