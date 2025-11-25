"use client"
import { cn } from "@/lib/utils"
import { CloseIcon } from "@/icons"
import { useEffect, useState } from "react"
import { EyeMini, EyeSlashMini } from "@medusajs/icons"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
  clearable?: boolean
  error?: boolean
  changeValue?: (value: string) => void
}

export function Input({
  label,
  icon,
  clearable,
  className,
  error,
  changeValue,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState(props.type)

  useEffect(() => {
    if (props.type === "password") {
      setInputType(showPassword ? "text" : "password")
    }
  }, [props.type, showPassword])

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeValue?.(e.target.value)
  }

  const clearHandler = () => {
    changeValue?.("")
  
    const event = new Event('input', { bubbles: true })
    document.querySelector('input')?.dispatchEvent(event)
  }

  return (
    <label className="w-full label-md">
      {label && <span className="block mb-2">{label}</span>}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500">{icon}</span>
          </span>
        )}

        {/* Main Input */}
        <input
          className={cn(
            "w-full h-10 sm:h-[38px] px-4 sm:px-[16px] py-2 sm:py-[12px] rounded-md border bg-component-secondary focus:border-primary focus:outline-none focus:ring-0 transition-colors",
            "placeholder:text-gray-500",
           
            icon ? "pl-10" : "pl-4",           
            
            clearable || props.type === "password" ? "pr-10" : "pr-4",
            error && "border-negative focus:border-negative",
            props.disabled && "bg-disabled cursor-not-allowed opacity-60",
            className
          )}
          value={props.value ?? ""}
          onChange={changeHandler}
          type={inputType}
          {...props}
        />

        {/* Clear Button */}
        {clearable && props.value && (
          <button
            type="button"
            onClick={clearHandler}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}

        {/* Password Toggle */}
        {props.type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeMini /> : <EyeSlashMini />}
          </button>
        )}
      </div>
    </label>
  )
}