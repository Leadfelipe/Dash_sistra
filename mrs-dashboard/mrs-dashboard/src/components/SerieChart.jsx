import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function SerieChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: "'DM Sans'" }}
          tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: "'DM Sans'" }}
          tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '12px', fontFamily: "'DM Sans'" }}
          cursor={{ fill: '#F3F4F6' }}
        />
        <Bar dataKey="value" name="Vistorias" fill="#2563EB" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
