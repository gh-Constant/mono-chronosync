import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-md active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-[0.98]',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:scale-[0.98]',
        ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline',
        purple: 'bg-purple-600 text-white dark:bg-purple-500 shadow hover:bg-purple-700 dark:hover:bg-purple-600 hover:shadow-md active:scale-[0.98]',
        success: 'bg-green-600 hover:bg-green-700 text-white shadow hover:shadow-md active:scale-[0.98]',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow hover:shadow-md active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 py-2 [&_svg]:size-4 [&_svg]:shrink-0',
        xs: 'h-7 rounded px-2 text-xs [&_svg]:size-3 [&_svg]:shrink-0',
        sm: 'h-8 rounded-md px-3 text-xs [&_svg]:size-3.5 [&_svg]:shrink-0',
        lg: 'h-10 rounded-md px-8 [&_svg]:size-5 [&_svg]:shrink-0',
        xl: 'h-12 rounded-md px-10 text-base [&_svg]:size-5 [&_svg]:shrink-0',
        icon: 'h-9 w-9 p-0 [&_svg]:size-4 [&_svg]:shrink-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
