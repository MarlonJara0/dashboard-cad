declare module 'lucide-react' {
  import { ComponentType } from 'react'
  
  interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string
    color?: string
    strokeWidth?: number | string
  }

  export const BarChart3: ComponentType<IconProps>
  export const ListTodo: ComponentType<IconProps>
  export const Circle: ComponentType<IconProps>
  export const X: ComponentType<IconProps>
  export const PlusCircle: ComponentType<IconProps>
  export const Trash2: ComponentType<IconProps>
  export const TrendingUp: ComponentType<IconProps>
  export const Pencil: ComponentType<IconProps>
} 