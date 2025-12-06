const ItemCard = ({ item, onAdd, onDecrement, onDelete }) => {
  const handleCardClick = (e) => {
    // Don't trigger add if clicking action buttons
    if (e.target.closest('.action-button')) {
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
      
      {/* Action buttons - appear on hover */}
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Decrement button */}
        {onDecrement && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDecrement()
            }}
            disabled={item.count === 0}
            className="action-button bg-orange-500 text-white rounded-full p-1.5 hover:bg-orange-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Diminuir quantidade"
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
                d="M20 12H4"
              />
            </svg>
          </button>
        )}
        
        {/* Increment button */}
        {onAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAdd()
            }}
            className="action-button bg-green-500 text-white rounded-full p-1.5 hover:bg-green-600 shadow-lg transition-all"
            title="Aumentar quantidade"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
        
        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="action-button bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-all"
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
      </div>
      
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
          Clique para adicionar ou use os botões ao passar o mouse
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export default ItemCard

