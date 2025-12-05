import { useState, useEffect, useRef } from 'react'

const COLOR_OPTIONS = [
  { name: 'Amarelo', value: 'from-amber-400 to-amber-600', preview: 'bg-amber-400' },
  { name: 'Azul', value: 'from-blue-300 to-blue-500', preview: 'bg-blue-400' },
  { name: 'Ciano', value: 'from-cyan-400 to-cyan-600', preview: 'bg-cyan-400' },
  { name: 'Laranja', value: 'from-orange-400 to-orange-600', preview: 'bg-orange-400' },
  { name: 'Amarelo Claro', value: 'from-yellow-400 to-yellow-600', preview: 'bg-yellow-400' },
  { name: 'Amarelo Suave', value: 'from-yellow-300 to-yellow-500', preview: 'bg-yellow-300' },
  { name: 'Verde', value: 'from-green-400 to-green-600', preview: 'bg-green-400' },
  { name: 'Rosa', value: 'from-pink-300 to-pink-500', preview: 'bg-pink-300' },
  { name: 'Roxo', value: 'from-purple-400 to-purple-600', preview: 'bg-purple-400' },
  { name: 'Vermelho', value: 'from-red-400 to-red-600', preview: 'bg-red-400' },
  { name: 'Índigo', value: 'from-indigo-400 to-indigo-600', preview: 'bg-indigo-400' },
  { name: 'Verde Esmeralda', value: 'from-emerald-400 to-emerald-600', preview: 'bg-emerald-400' },
]

const COMMON_EMOJIS = [
  '🍎', '🍌', '🍇', '🍊', '🍓', '🥝', '🍑', '🍒',
  '🥐', '🥖', '🥨', '🧀', '🥚', '🍳', '🥓', '🥞',
  '🥕', '🌽', '🥒', '🥬', '🥦', '🍄', '🥔', '🍠',
  '🥜', '🌰', '🥥', '🥑', '🍅', '🥒', '🌶', '🫑',
  '🥩', '🍗', '🥓', '🍖', '🌭', '🍔', '🍟', '🍕',
  '🥪', '🌮', '🌯', '🥙', '🧆', '🥘', '🍝', '🍜',
  '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙',
  '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧',
  '🍨', '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬',
  '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛',
  '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶',
  '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉',
  '🧊', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢', '🧂',
]

const AddItemModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📦')
  const [color, setColor] = useState(COLOR_OPTIONS[0].value)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        icon: icon || '📦',
        color: color,
      })
      // Reset form
      setName('')
      setIcon('📦')
      setColor(COLOR_OPTIONS[0].value)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Adicionar Novo Item
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="item-name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome do Item *
              </label>
              <input
                id="item-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: Tomate, Pão, etc."
                required
                autoFocus
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ícone
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-16 h-16 text-4xl flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50"
                  >
                    {icon || '📦'}
                  </button>
                  
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-10 max-h-64 overflow-y-auto w-80">
                      <div className="grid grid-cols-8 gap-2">
                        {COMMON_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setIcon(emoji)
                              setShowEmojiPicker(false)
                            }}
                            className="text-2xl hover:scale-125 transition-transform p-1"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <label className="block text-xs text-gray-600 mb-2">
                          Ou digite um emoji:
                        </label>
                        <input
                          type="text"
                          value={icon}
                          onChange={(e) => setIcon(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-2xl text-center"
                          placeholder="📦"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-2xl"
                    placeholder="📦"
                    maxLength={2}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Clique no ícone para escolher ou digite um emoji
                  </p>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cor
              </label>
              <div className="grid grid-cols-4 gap-3">
                {COLOR_OPTIONS.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    type="button"
                    onClick={() => setColor(colorOption.value)}
                    className={`relative h-12 rounded-lg border-2 transition-all ${
                      color === colorOption.value
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-full rounded ${colorOption.preview}`}></div>
                    {color === colorOption.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white drop-shadow-lg"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {name && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className={`bg-gradient-to-br ${color} rounded-lg p-4 flex items-center gap-3`}>
                  <span className="text-3xl">{icon || '📦'}</span>
                  <span className="text-white font-semibold text-lg">{name}</span>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={!name.trim()}
              >
                Adicionar Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddItemModal

