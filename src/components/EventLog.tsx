interface EventLogProps {
  history: string[];
}

const EventLog = ({ history }: EventLogProps) => {
  return (
    <section className="lg:col-span-3 bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold mb-2">이벤트 로그</h2>
      {history.length === 0 ? (
        <div className="text-sm text-gray-500">아직 이벤트가 없습니다.</div>
      ) : (
        <ul className="text-sm space-y-1 max-h-40 overflow-auto">
          {history.map((h, i) => (
            <li key={i} className="text-gray-700">
              • {h}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default EventLog;
