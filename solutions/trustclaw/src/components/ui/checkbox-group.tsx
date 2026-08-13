'use client'

import * as React from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import * as RovingFocusGroup from '@radix-ui/react-roving-focus'
import { CheckIcon } from 'lucide-react'

import { cn } from '~/lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxGroupContextValue {
  value: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
  name?: string
  required?: boolean
}

const CheckboxGroupContext =
  React.createContext<CheckboxGroupContextValue | null>(null)

function useCheckboxGroupContext() {
  const context = React.useContext(CheckboxGroupContext)
  if (!context) {
    throw new Error(
      'CheckboxGroup components must be used within a CheckboxGroup'
    )
  }
  return context
}

/* -------------------------------------------------------------------------------------------------
 * CheckboxGroup
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  name?: string
  required?: boolean
}

function CheckboxGroup({
  className,
  value,
  onValueChange,
  disabled,
  orientation = 'vertical',
  loop = true,
  name,
  required,
  children,
  ...props
}: CheckboxGroupProps) {
  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange,
      disabled,
      name,
      required,
    }),
    [value, onValueChange, disabled, name, required]
  )

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <RovingFocusGroup.Root asChild orientation={orientation} loop={loop}>
        <div
          role="group"
          data-slot="checkbox-group"
          data-orientation={orientation}
          className={cn(
            'grid gap-3',
            orientation === 'horizontal' && 'grid-flow-col',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </RovingFocusGroup.Root>
    </CheckboxGroupContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * CheckboxGroupItem
 * -----------------------------------------------------------------------------------------------*/

interface CheckboxGroupItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    'checked' | 'onCheckedChange' | 'defaultChecked'
  > {
  value: string
}

const CheckboxGroupItem = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxGroupItemProps
>(({ className, value, disabled, children, ...props }, ref) => {
  const context = useCheckboxGroupContext()
  const isChecked = context.value.includes(value)
  const isDisabled = disabled ?? context.disabled

  function handleCheckedChange(checked: boolean | 'indeterminate') {
    if (checked === 'indeterminate') return

    if (checked) {
      context.onValueChange([...context.value, value])
    } else {
      context.onValueChange(context.value.filter((v) => v !== value))
    }
  }

  return (
    <RovingFocusGroup.Item asChild focusable={!isDisabled}>
      <CheckboxPrimitive.Root
        ref={ref}
        data-slot="checkbox-group-item"
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        disabled={isDisabled}
        name={context.name}
        value={value}
        required={context.required && context.value.length === 0}
        className={cn('group peer outline-none', className)}
        {...props}
      >
        {children}
      </CheckboxPrimitive.Root>
    </RovingFocusGroup.Item>
  )
})
CheckboxGroupItem.displayName = 'CheckboxGroupItem'

/* -------------------------------------------------------------------------------------------------
 * CheckboxGroupIndicator
 * -----------------------------------------------------------------------------------------------*/

const CheckboxGroupIndicator = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>(({ className, children, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Indicator
      ref={ref}
      data-slot="checkbox-group-indicator"
      className={cn('flex items-center justify-center text-current', className)}
      {...props}
    >
      {children ?? <CheckIcon className="size-3.5 text-white" />}
    </CheckboxPrimitive.Indicator>
  )
})
CheckboxGroupIndicator.displayName = 'CheckboxGroupIndicator'

/* -------------------------------------------------------------------------------------------------
 * Primitive exports for custom usage
 * -----------------------------------------------------------------------------------------------*/

const CheckboxGroupPrimitive = {
  Root: CheckboxGroup,
  Item: CheckboxGroupItem,
  Indicator: CheckboxGroupIndicator,
}

export {
  CheckboxGroup,
  CheckboxGroupItem,
  CheckboxGroupIndicator,
  CheckboxGroupPrimitive,
  useCheckboxGroupContext,
}
export type { CheckboxGroupProps, CheckboxGroupItemProps }
