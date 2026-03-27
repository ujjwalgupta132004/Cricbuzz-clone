import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PlayerStatsChart = ({ labels, values, title, color = '#15803d' }) => {
    const chartData = {
        labels,
        datasets: [{
            label: title,
            data: values,
            backgroundColor: `${color}33`,
            borderColor: color,
            borderWidth: 2,
            borderRadius: 8,
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: title, font: { size: 16 } }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-5">
            <Bar data={chartData} options={options} />
        </div>
    );
};
export default PlayerStatsChart;
