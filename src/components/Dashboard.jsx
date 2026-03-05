import { useState, useEffect, useRef, useCallback } from 'react'
import logo from '../img/Logo Bon-dja_redondo.png'
import ItemCard from './ItemCard'
import ChartView from './ChartView'
import AddItemModal from './AddItemModal'
import { getItems, saveItems, subscribeToItems } from '../services/dataService'
import { isFirebaseConfigured } from '../config/firebase'

const INITIAL_ITEMS = [
  { id: 1, name: 'Kit Famílias', icon: '📦', color: 'from-blue-400 to-blue-600', price: 37.00 },
  { id: 2, name: 'Arroz', icon: '🌾', color: 'from-amber-400 to-amber-600', price: 1.50 },
  { id: 3, name: 'Água', icon: '💧', color: 'from-cyan-400 to-cyan-600', price: 1.00 },
  { id: 4, name: 'Feijão', icon: '🫘', color: 'from-orange-400 to-orange-600', price: 1.20 },
  { id: 5, name: 'Massa', icon: '🍝', color: 'from-yellow-300 to-yellow-500', price: 1.00 },
  { id: 6, name: 'Óleo', icon: '🫒', color: 'from-green-400 to-green-600', price: 1.90 },
  { id: 7, name: 'Açúcar', icon: '🍬', color: 'from-pink-300 to-pink-500', price: 1.00 },
  { id: 8, name: 'Sal', icon: '🧂', color: 'from-gray-300 to-gray-500', price: 0.55 },
  { id: 9, name: 'Atum', icon: '🐟', color: 'from-blue-400 to-blue-600', price: 1.20 },
  { id: 10, name: 'Bolachas', icon: '🍪', color: 'from-yellow-400 to-yellow-600', price: 1.65 },
  { id: 11, name: 'Grão', icon: '🟤', color: 'from-amber-300 to-amber-500', price: 1.20 },
  { id: 12, name: 'Legumes em conserva', icon: '🥫', color: 'from-green-300 to-green-500', price: 2.00 },
  { id: 13, name: 'Milho', icon: '🌽', color: 'from-yellow-400 to-yellow-600', price: 1.15 },
  { id: 14, name: 'Tomate', icon: '🍅', color: 'from-red-400 to-red-600', price: 0.80 },
  { id: 15, name: 'Cogumelos', icon: '🍄', color: 'from-stone-400 to-stone-600', price: 2.20 },
  { id: 16, name: 'Azeite', icon: '🫒', color: 'from-lime-400 to-lime-600', price: 4.00 },
  { id: 17, name: 'Vinagre', icon: '🍶', color: 'from-rose-300 to-rose-500', price: 0.90 },
  { id: 18, name: 'Salsicha', icon: '🌭', color: 'from-red-300 to-red-500', price: 1.20 },
]

const Dashboard = () => {
  const [items, setItems] = useState([])
  const [chartType, setChartType] = useState('pie') // 'pie' or 'bar'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [showContactToast, setShowContactToast] = useState(false)
  const [sessionAdditions, setSessionAdditions] = useState({})
  const toastTimerRef = useRef(null)

  const triggerContactToast = useCallback(() => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setShowContactToast(true)
    toastTimerRef.current = setTimeout(() => setShowContactToast(false), 4000)
  }, [])

  const dismissContactToast = useCallback(() => {
    setShowContactToast(false)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
  }, [])

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
      // Build a map of saved counts by name (normalized to lowercase)
      const savedCounts = {}
      parsedItems.forEach(savedItem => {
        const name = savedItem.name.toLowerCase().trim()
        savedCounts[name] = (savedCounts[name] || 0) + (savedItem.count || 0)
      })
      // Also match common name variations
      if (savedCounts['macarrão']) {
        savedCounts['massa'] = (savedCounts['massa'] || 0) + savedCounts['macarrão']
      }
      if (savedCounts['biscoitos'] || savedCounts['bolacha maria']) {
        savedCounts['bolachas'] = (savedCounts['bolachas'] || 0) + (savedCounts['biscoitos'] || 0) + (savedCounts['bolacha maria'] || 0)
      }

      // Create items from INITIAL_ITEMS, carrying over saved counts by name
      const processedItems = INITIAL_ITEMS.map(initialItem => {
        const name = initialItem.name.toLowerCase().trim()
        const count = savedCounts[name] || 0
        return { ...initialItem, count }
      })

      setItems(processedItems)
      // Save clean data back to sync prices and remove orphaned items
      saveItems(processedItems)
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
    triggerContactToast()
    setSessionAdditions(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }))
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, count: item.count + 1 } : item
      )
      saveItems(updatedItems)
      return updatedItems
    })
  }

  const handleDecrementItem = (itemId) => {
    setSessionAdditions(prev => {
      const current = prev[itemId] || 0
      if (current <= 0) return prev
      return { ...prev, [itemId]: current - 1 }
    })
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId 
          ? { ...item, count: Math.max(0, item.count - 1) } 
          : item
      )
      saveItems(updatedItems)
      return updatedItems
    })
  }

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os contadores?')) {
      const resetItems = items.map((item) => ({ ...item, count: 0 }))
      setItems(resetItems)
      saveItems(resetItems)
    }
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
    const itemToDelete = items.find(item => item.id === itemId)
    const itemName = itemToDelete ? itemToDelete.name : 'este item'
    
    if (window.confirm(`Tem certeza que deseja remover "${itemName}"? Esta ação não pode ser desfeita e o contador será perdido.`)) {
      setItems((prevItems) => {
        const updatedItems = prevItems.filter(item => item.id !== itemId)
        saveItems(updatedItems)
        return updatedItems
      })
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.count, 0)
  const sessionTotalPrice = items.reduce((sum, item) => {
    const addedCount = sessionAdditions[item.id] || 0
    return sum + (addedCount * (item.price || 0))
  }, 0)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Logo Bon-dja"
                className="w-14 h-14 rounded-full object-cover"
              />
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
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Apagar tudo
              </button>
            </div>
          </div>
        </div>

        {/* Introductory Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">O Projeto Bon-dja</h2>
          <div className="text-gray-700 space-y-3 leading-relaxed">
            <p>
              O Bon-dja é um projeto de missão e intervenção social que apoia crianças e jovens em situação de vulnerabilidade em São Tomé. Em 2026, uma equipa de 30 voluntárias — jovens universitárias do Porto e Braga — dedicará duas semanas do verão ao trabalho no terreno com a Associação ARCAR, uma instituição que, desde 1991, acolhe crianças e jovens em situação de risco.
            </p>
            <p>
              O nosso projeto distingue-se pela continuidade. Ao longo de todo o ano acompanhamos a instituição, preparamos a missão e angariamos recursos essenciais para garantir um impacto real e duradouro.
            </p>
            <p className="font-semibold italic text-gray-800">
              O nosso lema é: "1 ano de formação, 2 semanas em ação, 1 vida em missão."
            </p>
            <p>
              <span className="font-semibold">Como pode ajudar?</span> Estamos a angariar alimentos não perecíveis para levar connosco e entregar diretamente às crianças, jovens e famílias apoiados pela ARCAR. Cada contributo conta.
            </p>
            <p className="font-semibold text-gray-800">
              Cada gesto faz a diferença.<br />
              Cada embalagem ajuda-nos a transformar realidades.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Preços:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              <div className="bg-blue-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Kit famílias</span> — 37,00 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Arroz</span> — 1,50 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Água</span> — 1,00 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Feijão</span> — 1,20 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Massa</span> — 1,00 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Óleo</span> — 1,90 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Açúcar</span> — 1,00 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Sal</span> — 0,55 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Atum</span> — 1,20 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Bolachas</span> — 1,65 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Grão</span> — 1,20 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Legumes em conserva</span> — 2,00 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Milho</span> — 1,15 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Tomate</span> — 0,80 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Cogumelos</span> — 2,20 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Azeite</span> — 4,00 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Vinagre</span> — 0,90 €</div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm"><span className="font-semibold">Salsicha</span> — 1,20 €</div>
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
          <ChartView 
            items={items} 
            chartType={chartType}
            onIncrement={handleAddItem}
            onDecrement={handleDecrementItem}
          />
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

                onDelete={() => handleDeleteItem(item.id)}
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

      {/* Contacts sidebar */}
      <div className="hidden lg:block fixed top-6 right-6 z-40">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-56">
          <h3 className="font-bold text-gray-800 text-sm mb-3 border-b pb-2">Contactos</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-gray-700">Ana Rita</span><a href="tel:+351967167604" className="text-blue-600 hover:underline">967 167 604</a></li>
            <li className="flex justify-between"><span className="text-gray-700">Cláudia</span><a href="tel:+351927555443" className="text-blue-600 hover:underline">927 555 443</a></li>
            <li className="flex justify-between"><span className="text-gray-700">Mariana</span><a href="tel:+351939055504" className="text-blue-600 hover:underline">939 055 504</a></li>
            <li className="flex justify-between"><span className="text-gray-700">Núria</span><a href="tel:+351969536576" className="text-blue-600 hover:underline">969 536 576</a></li>
            <li className="flex justify-between"><span className="text-gray-700">Verónica</span><a href="tel:+351934009699" className="text-blue-600 hover:underline">934 009 699</a></li>
            <li className="flex justify-between"><span className="text-gray-700">Inês</span><a href="tel:+351932053042" className="text-blue-600 hover:underline">932 053 042</a></li>
          </ul>
          {sessionTotalPrice > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">A sua contribuição</p>
              <p className="text-lg font-bold text-green-600">{sessionTotalPrice.toFixed(2).replace('.', ',')} €</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact toast notification */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-500 ease-in-out ${
          showContactToast
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-800 mb-2">Para contribuir, contacte:</p>
              <p className="text-gray-700 text-sm">+351 927 555 443</p>
              <p className="text-gray-700 text-sm">+351 932 053 042</p>
            </div>
            <button
              onClick={dismissContactToast}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

