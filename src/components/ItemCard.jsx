const ItemCard = ({ item, onAdd, onDelete }) => {
  const handleCardClick = (e) => {
    // Don't trigger add if clicking delete button
    if (e.target.closest('.delete-button')) {
      return
    }
    onAdd()
  }

  return (
    <div
      onClick={handleCardClick}
      className="card-hover bg-gradient-to-br cursor-pointer rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden group"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      {/* Delete button for custom items */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="delete-button absolute top-2 right-2 z-20 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
          title="Remover item"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{item.icon}</div>
          <div className="bg-white/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl font-bold text-gray-800">{item.count}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {item.name}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Clique para adicionar
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export default ItemCard

