import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ItemCard from './ItemCard'
import ChartView from './ChartView'
import AddItemModal from './AddItemModal'
import { getItems, saveItems, subscribeToItems } from '../services/dataService'
import { isFirebaseConfigured } from '../config/firebase'

const INITIAL_ITEMS = [
  { id: 1, name: 'Arroz', icon: '🌾', color: 'from-amber-400 to-amber-600' },
  { id: 2, name: 'Leite', icon: '🥛', color: 'from-blue-300 to-blue-500' },
  { id: 3, name: 'Água', icon: '💧', color: 'from-cyan-400 to-cyan-600' },
  { id: 4, name: 'Feijão', icon: '🫘', color: 'from-orange-400 to-orange-600' },
  { id: 5, name: 'Biscoitos', icon: '🍪', color: 'from-yellow-400 to-yellow-600' },
  { id: 6, name: 'Massa', icon: '🍝', color: 'from-yellow-300 to-yellow-500' },
  { id: 7, name: 'Óleo', icon: '🫒', color: 'from-green-400 to-green-600' },
  { id: 8, name: 'Açúcar', icon: '🍬', color: 'from-pink-300 to-pink-500' },
]

const Dashboard = ({ setIsAuthenticated }) => {
  const [items, setItems] = useState([])
  const [chartType, setChartType] = useState('pie') // 'pie' or 'bar'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let unsubscribe = () => {}

    const loadAndSyncItems = async () => {
      // If Firebase is configured, subscribe to real-time updates
      if (isFirebaseConfigured) {
        unsubscribe = subscribeToItems((savedItems) => {
          if (savedItems && savedItems.length > 0) {
            processAndSetItems(savedItems)
          } else {
            // No data exists - initialize with default items
            console.log('🆕 Initializing with default items')
            const initialItems = INITIAL_ITEMS.map(item => ({ ...item, count: 0 }))
            setItems(initialItems)
            // Save to Firebase
            saveItems(initialItems).then(() => {
              console.log('✅ Initial items saved to Firebase')
            })
          }
        })
      } else {
        // Load from localStorage or Firebase (fallback)
        const savedItems = await getItems()
        if (savedItems && savedItems.length > 0) {
          processAndSetItems(savedItems)
        } else {
          // Initialize with default items
          const initialItems = INITIAL_ITEMS.map(item => ({ ...item, count: 0 }))
          setItems(initialItems)
          saveItems(initialItems)
        }
      }
    }

    const processAndSetItems = (parsedItems) => {
      // Migrate old "Macarrão" to "Massa" and sync with current INITIAL_ITEMS
      let processedItems = parsedItems.map(savedItem => {
        // Find matching item in INITIAL_ITEMS by ID
        const currentItem = INITIAL_ITEMS.find(item => item.id === savedItem.id)
        
        if (currentItem) {
          // Update with current item properties but keep the count
          return {
            ...currentItem,
            count: savedItem.count || 0
          }
        }
        
        // If item not found, return saved item (for backwards compatibility)
        return savedItem
      })
      
      // Ensure all INITIAL_ITEMS are present (in case new items were added)
      INITIAL_ITEMS.forEach(initialItem => {
        const exists = processedItems.find(item => item.id === initialItem.id)
        if (!exists) {
          processedItems.push({ ...initialItem, count: 0 })
        }
      })
      
      // Sort by ID to maintain order
      processedItems.sort((a, b) => a.id - b.id)
      
      setItems(processedItems)
      // Save processed items back (only if not using real-time sync)
      if (!isFirebaseConfigured) {
        saveItems(processedItems)
      }
    }

    loadAndSyncItems()

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const handleAddItem = (itemId) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, count: item.count + 1 } : item
      )
      saveItems(updatedItems)
      return updatedItems
    })
  }

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os contadores?')) {
      const resetItems = items.map((item) => ({ ...item, count: 0 }))
      setItems(resetItems)
      saveItems(resetItems)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const handleAddNewItem = (newItem) => {
    // Generate new ID (find max ID and add 1, or start from 1000 for custom items)
    const maxId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0
    const newId = maxId >= 1000 ? maxId + 1 : 1000
    
    const itemToAdd = {
      id: newId,
      ...newItem,
      count: 0,
    }
    
    setItems((prevItems) => {
      const updatedItems = [...prevItems, itemToAdd]
      saveItems(updatedItems)
      return updatedItems
    })
  }

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Tem certeza que deseja remover este item? Esta ação não pode ser desfeita.')) {
      setItems((prevItems) => {
        const updatedItems = prevItems.filter(item => item.id !== itemId)
        saveItems(updatedItems)
        return updatedItems
      })
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Dashboard de Doações de Alimentos
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  Total de itens doados: <span className="font-bold text-blue-600">{totalItems}</span>
                </p>
                {isFirebaseConfigured && (
                  <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Sincronizado
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Resetar Contadores
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              Visão Geral
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('pie')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  chartType === 'pie'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Gráfico Circular
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  chartType === 'bar'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Gráfico de Barras
              </button>
            </div>
          </div>
          <ChartView items={items} chartType={chartType} />
        </div>

        {/* Items Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Itens Disponíveis
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
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
              Adicionar Item
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onAdd={() => handleAddItem(item.id)}
                onDelete={item.id >= 1000 ? () => handleDeleteItem(item.id) : null}
              />
            ))}
          </div>
        </div>

        {/* Add Item Modal */}
        <AddItemModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddNewItem}
        />
      </div>
    </div>
  )
}

export default Dashboard

