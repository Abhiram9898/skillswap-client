const TableCard = ({ title, columns, data, renderRow }) => (
  <div className="bg-white rounded-xl shadow-md p-5 overflow-x-auto">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <table className="min-w-full text-left">
      <thead>
        <tr className="text-xs font-semibold text-gray-500 border-b">
          {columns.map((col, idx) => (
            <th key={idx} className="py-2">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? data.map(renderRow) : (
          <tr>
            <td colSpan={columns.length} className="py-4 text-center text-sm text-gray-400">
              No data available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default TableCard;
