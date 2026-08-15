function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
      {Icon && <Icon size={56} className="mx-auto mb-5 text-gray-300" />}

      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>

      {description && (
        <p className="mx-auto mt-3 max-w-md text-gray-500">{description}</p>
      )}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;