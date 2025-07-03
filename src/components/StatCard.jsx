const StatCard = ({ title, value, subtitle, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
  };

  const textColor = colorMap[color] || 'text-gray-700'; // fallback

  return (
    <div className="space-y-1 bg-white p-4 rounded-lg shadow-sm hover:shadow transition-all duration-200">
      <h4 className="text-gray-500 text-sm font-semibold">{title}</h4>
      <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
