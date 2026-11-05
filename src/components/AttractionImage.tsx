type AttractionImageProps = {
  /** Image URL. When missing, a placeholder is shown instead. */
  src?: string
  alt: string
  className?: string
}

function AttractionImage({ src, alt, className = '' }: AttractionImageProps) {
  if (!src) {
    return (
      <div className={`attraction-image attraction-image--empty ${className}`}>
        No image available
      </div>
    )
  }

  return (
    <img
      className={`attraction-image ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
    />
  )
}

export default AttractionImage
