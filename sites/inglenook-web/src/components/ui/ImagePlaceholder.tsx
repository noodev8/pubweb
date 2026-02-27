interface ImagePlaceholderProps {
  filename: string
  width: number
  height: number
  description: string
  className?: string
}

export function ImagePlaceholder({
  filename,
  width,
  height,
  description,
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`bg-stone-200 flex flex-col items-center justify-center text-stone-500 ${className}`}
    >
      <svg className="w-12 h-12 mb-3 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
      <p className="text-sm font-medium">{filename}</p>
      <p className="text-xs">{width} x {height}</p>
      <p className="text-xs mt-1 text-stone-400 text-center px-4">{description}</p>
    </div>
  )
}
