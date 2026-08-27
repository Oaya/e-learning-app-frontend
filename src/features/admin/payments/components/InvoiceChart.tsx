import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  monthlyData: {
    month: string;
    Earned: number;
    Outstanding: number;
  }[];
  currency?: string | null;
};

function getLast12Months() {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      month: d.toLocaleString("default", { month: "short", year: "numeric" }),
    });
  }
  return months;
}

export default function InvoiceChart({ monthlyData, currency }: Props) {
  const last12 = getLast12Months();
  const dataMap = Object.fromEntries(monthlyData.map((d) => [d.month, d]));
  const chartData = last12.map(({ month }) => ({
    month,
    Earned: dataMap[month]?.Earned ?? 0,
    Outstanding: dataMap[month]?.Outstanding ?? 0,
  }));

  const dataMax = Math.max(
    ...chartData.map((d) => Math.max(d.Earned, d.Outstanding)),
    0,
  );

  return (
    <div className="panel-box">
      <p className="panel-header mb-4">Revenue overview</p>
      <div style={{ height: 200 }}>
        <Bar
          data={{
            labels: chartData.map((d) => d.month),
            datasets: [
              {
                label: "Earned",
                data: chartData.map((d) => d.Earned),
                backgroundColor: "#b8db80",
                borderRadius: { topLeft: 4, topRight: 4 },
                borderSkipped: false,
                barPercentage: 0.9,
                categoryPercentage: 0.6,
              },
              {
                label: "Outstanding",
                data: chartData.map((d) => d.Outstanding),
                backgroundColor: "#d3688a",
                borderRadius: { topLeft: 4, topRight: 4 },
                borderSkipped: false,
                barPercentage: 0.9,
                categoryPercentage: 0.6,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: "#9ca3af", font: { size: 12 } },
              },
              y: {
                min: 0,
                max: Math.max(dataMax, 1000),
                grid: { display: true },
                border: { display: false },
                ticks: {
                  color: "#9ca3af",
                  font: { size: 12 },
                  stepSize: Math.max(dataMax, 1000) / 5,
                },
              },
            },
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  usePointStyle: true,
                  pointStyle: "circle",
                  boxWidth: 8,
                  font: { size: 12 },
                },
              },
              tooltip: {
                backgroundColor: "#fff",
                titleColor: "#111827",
                bodyColor: "#111827",
                borderColor: "#e5e7eb",
                borderWidth: 0.5,
                cornerRadius: 8,
                bodyFont: { size: 12 },
                titleFont: { size: 12 },
                callbacks: {
                  label: (item: TooltipItem<"bar">) =>
                    `${item.dataset.label}: ${currency ?? ""} ${Number(item.raw).toFixed(2)}`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
