type Props = {
    children: React.ReactNode
    className?: string
  }
  
  export default function Card({ children, className = '' }: Props) {
    return <div className={`card-ui ${className}`}>{children}</div>
  }