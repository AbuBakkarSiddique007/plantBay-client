import {
    Area, Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import PropTypes from 'prop-types';


const Chart = ({ chartData }) => {
    //  { quantity: 14, price: 60, order: 2, date: '01-10-2025' }
    const parseDateLabel = (raw) => {
        if (!raw) return '';

        const parts = String(raw).split('-');
        if (parts.length === 3) {
            const [dd, mm, yyyy] = parts;
            const iso = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
            const d = new Date(iso);
            if (!isNaN(d)) return d.toLocaleDateString();
        }

        const d2 = new Date(raw);
        return isNaN(d2) ? String(raw) : d2.toLocaleDateString();
    };

    const normalized = Array.isArray(chartData) && chartData.length > 0
        ? chartData.map(item => ({
            date: parseDateLabel(item.date ?? item._id ?? item.dateString),
            quantity: Number(item.quantity ?? item.qty ?? 0) || 0,
            price: Number(item.price ?? item.totalPrice ?? 0) || 0,
            order: Number(item.order ?? item.orders ?? 0) || 0,
        }))
        : [{ date: parseDateLabel('07-10-2025'), quantity: 590, price: 800, order: 1400 }];

    console.log('Chart normalized data ->', normalized);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                width={500}
                height={400}
                data={normalized}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="order" fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="price" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="quantity" stroke="#ff7300" />
            </ComposedChart>
        </ResponsiveContainer>
    );
};


export default Chart;

Chart.propTypes = {
    chartData: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        order: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })),
};

Chart.defaultProps = {
    chartData: [],
};