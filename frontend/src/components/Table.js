export default function Table({ columns, data }) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              {columns.map(col => (
                <th key={col} className="p-2 border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">Sin datos</td>
              </tr>
            )}
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50">
                {columns.map(col => (
                  <td key={col} className="p-2 border">{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }