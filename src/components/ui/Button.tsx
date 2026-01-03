import React from 'react'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-sky-600 text-white hover:bg-sky-700',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100'
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'
  size?: 'default' | 'sm'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button ref={ref} className={clsx(buttonVariants({ variant, size }), className)} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
