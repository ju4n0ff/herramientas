import { useCustomCursor } from '../hooks/useCustomCursor'
import styles from '../styles/Cursor.module.css'

export default function Cursor() {
  const cursorRef = useCustomCursor()

  return (
    <div
      className={styles.cursor}
      ref={cursorRef}
      aria-hidden="true"
      role="presentation"
    />
  )
}
