import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Chart as ChartJS,
} from "chart.js";
import { getLast7Days } from "@/lib/features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement
);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: true,
      },
    },
    y: {
      bigInAtZero: true,
      grid: {
        display: true,
      },
    },
  },
};

const LineChart = ( {value = []}:any ) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Meetings",
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,0.3)",
      },
    ],
  };
  return <Line data={data} options={lineChartOptions}></Line>;
};

export { LineChart };
