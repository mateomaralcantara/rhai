type Props = {
    children: React.ReactNode
    className?: string
  }
  
  export default function Container({ children, className = '' }: Props) {
    return <div className={`container-page ${className}`}>{children}</div>
  }