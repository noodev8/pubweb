export function HexagonPattern({ className = '' }: { className?: string }) {
  // Simple honeycomb pattern with individual hexagons
  const hexSize = 40
  const rows = 6
  const cols = 6

  const hexagons = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.5
      const y = row * hexSize * 1.73 + (col % 2 ? hexSize * 0.865 : 0)
      hexagons.push(
        <path
          key={`${row}-${col}`}
          d={`M${x + hexSize * 0.5} ${y}
              L${x + hexSize} ${y + hexSize * 0.29}
              L${x + hexSize} ${y + hexSize * 0.87}
              L${x + hexSize * 0.5} ${y + hexSize * 1.15}
              L${x} ${y + hexSize * 0.87}
              L${x} ${y + hexSize * 0.29} Z`}
          fill="none"
          stroke="#6b7280"
          strokeWidth="1"
        />
      )
    }
  }

  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {hexagons}
    </svg>
  )
}
