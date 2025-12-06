import { useState, useRef, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#f97316', // orange
  '#eab308', // yellow
  '#fbbf24', // yellow-300
  '#4ade80', // green
  '#f472b6', // pink
]

const ChartView = ({ items, chartType, onIncrement, onDecrement }) => {
  const [tooltip, setTooltip] = useState({ show: false, itemId: null, x: 0, y: 0 })
  const tooltipRef = useRef(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  
  const chartData = items
    .filter(item => item.count > 0)
    .map(item => ({
      id: item.id,
      name: item.name,
      value: item.count,
      icon: item.icon,
    }))

  const handleItemHover = (itemId, e) => {
    const x = e?.clientX || e?.touches?.[0]?.clientX || 0
    const y = e?.clientY || e?.touches?.[0]?.clientY || 0
    setTooltip({ show: true, itemId, x, y })
  }

  const handleItemLeave = () => {
    // Delay hiding to allow mouse to move into tooltip
    setTimeout(() => {
      if (tooltipRef.current && !tooltipRef.current.matches(':hover')) {
        setTooltip({ show: false, itemId: null, x: 0, y: 0 })
      }
    }, 100)
  }

  // Track mouse position globally
  useEffect(() => {
    const updateMousePosition = (e) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY }
    }
    document.addEventListener('mousemove', updateMousePosition)
    return () => document.removeEventListener('mousemove', updateMousePosition)
  }, [])

  const handlePieClick = (data, index, e) => {
    console.log('handlePieClick called:', { data, index, e })
    // Recharts Pie onClick receives: (data, index, e) where data is the clicked entry
    const clickedData = data || chartData[index]
    console.log('Clicked data:', clickedData)
    
    if (clickedData?.id) {
      // Use tracked mouse position as fallback
      const x = mousePositionRef.current.x || window.innerWidth / 2
      const y = mousePositionRef.current.y || window.innerHeight / 2
      
      console.log('Setting tooltip at:', x, y, 'for item:', clickedData.id)
      setTooltip({ show: true, itemId: clickedData.id, x: x + 20, y: y - 50 })
    }
  }

  const handleBarClick = (data, index, e) => {
    console.log('handleBarClick called:', { data, index, e })
    // Recharts Bar onClick receives: (data, index, e) where data is the clicked entry
    const clickedData = data || chartData[index]
    console.log('Clicked bar data:', clickedData)
    
    if (clickedData?.id) {
      // Use tracked mouse position as fallback
      const x = mousePositionRef.current.x || window.innerWidth / 2
      const y = mousePositionRef.current.y || window.innerHeight / 2
      
      console.log('Setting tooltip at:', x, y, 'for item:', clickedData.id)
      setTooltip({ show: true, itemId: clickedData.id, x: x + 20, y: y - 50 })
    }
  }

  const handleTooltipEnter = () => {
    // Keep tooltip open when mouse enters it
    setTooltip(prev => ({ ...prev, show: true }))
  }

  const handleTooltipLeave = () => {
    setTooltip({ show: false, itemId: null, x: 0, y: 0 })
  }


  // Handle click outside to dismiss tooltip
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltip.show && tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        // Check if click is not on a chart element
        const isChartElement = e.target.closest('.recharts-wrapper') || 
                               e.target.closest('.recharts-pie') ||
                               e.target.closest('.recharts-bar') ||
                               e.target.closest('.recharts-cell')
        if (!isChartElement) {
          setTooltip({ show: false, itemId: null, x: 0, y: 0 })
        }
      }
    }

    if (tooltip.show) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [tooltip.show])

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-lg">Nenhum item adicionado ainda</p>
          <p className="text-sm mt-2">Clique nos itens abaixo para começar</p>
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">
            {data.icon} {data.name}
          </p>
          <p className="text-blue-600 font-bold">
            Quantidade: {data.value}
          </p>
        </div>
      )
    }
    return null
  }

  const InteractiveTooltip = () => {
    if (!tooltip.show || !tooltip.itemId) return null
    
    const item = chartData.find(d => d.id === tooltip.itemId)
    if (!item) return null

    return (
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-white rounded-lg shadow-xl border-2 border-blue-500 p-3 min-w-[160px]"
        style={{
          left: `${Math.min(tooltip.x, window.innerWidth - 180)}px`,
          top: `${Math.min(tooltip.y - 80, window.innerHeight - 120)}px`,
          zIndex: 9999
        }}
        onMouseEnter={handleTooltipEnter}
        onMouseLeave={handleTooltipLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-3">
          <div className="text-2xl mb-1">{item.icon}</div>
          <div className="font-semibold text-gray-800">{item.name}</div>
          <div className="text-sm text-gray-600 mt-1">
            Quantidade: <span className="font-bold text-blue-600 text-lg">{item.value}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (onDecrement && item.value > 0) {
                onDecrement(item.id)
              }
            }}
            disabled={item.value === 0}
            className="flex-1 bg-red-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            -1
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (onIncrement) {
                onIncrement(item.id)
              }
            }}
            className="flex-1 bg-green-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            +1
          </button>
        </div>
      </div>
    )
  }

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => {
          const itemData = chartData.find(d => d.name === entry.value)
          if (!itemData) return null
          
          return (
            <div
              key={index}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200"
            >
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {itemData.icon} {entry.value}
              </span>
              <span className="text-sm font-bold text-blue-600">
                {itemData.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderLabel = (entry) => {
    return `${entry.icon} ${entry.name}`
  }

  if (chartType === 'pie') {
    // Create legend payload manually since we're rendering it outside
    const legendPayload = chartData.map((item, index) => ({
      value: item.name,
      color: COLORS[index % COLORS.length],
      payload: item
    }))

    return (
      <div className="w-full relative">
        <div className="h-[350px] sm:h-[400px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              animationDuration={500}
              style={{ cursor: 'pointer' }}
              onClick={handlePieClick}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} trigger="hover" />
          </PieChart>
          </ResponsiveContainer>
        </div>
        <InteractiveTooltip />
        <CustomLegend payload={legendPayload} />
        <p className="text-center text-sm text-gray-500 mt-4">
          💡 Clique nos elementos do gráfico para ver os controles
        </p>
      </div>
    )
  }


  // Create legend payload manually for bar chart
  const barLegendPayload = chartData.map((item, index) => ({
    value: item.name,
    color: COLORS[index % COLORS.length],
    payload: item
  }))

  return (
    <div className="w-full relative">
      <div className="h-[350px] sm:h-[400px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => {
                const item = chartData.find(d => d.name === value)
                return item ? `${item.icon} ${value}` : value
              }}
            />
            <YAxis tick={{ fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} trigger="hover" />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              animationDuration={500}
              style={{ cursor: 'pointer' }}
              onClick={handleBarClick}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <InteractiveTooltip />
      <CustomLegend payload={barLegendPayload} />
      <p className="text-center text-sm text-gray-500 mt-4">
        💡 Clique nas barras para ver os controles
      </p>
    </div>
  )
}

export default ChartView

