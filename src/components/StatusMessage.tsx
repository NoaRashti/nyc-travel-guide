type StatusMessageProps = {
  type: 'loading' | 'error' | 'empty'
  message: string
}

function StatusMessage({ type, message }: StatusMessageProps) {
  return (
    <p
      className={`status-message status-message--${type}`}
      // Screen readers announce errors right away, other messages politely.
      role={type === 'error' ? 'alert' : 'status'}
    >
      {message}
    </p>
  )
}

export default StatusMessage
