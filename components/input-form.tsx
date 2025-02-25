'use client'

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check } from "lucide-react";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  validation?: {
    patternString?: string; // Changed from RegExp to string
    message?: string;
  };
  className?: string;
}

export const FormInput = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  minLength,
  validation,
  className,
}: FormInputProps) => {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState(false);

  const validate = (inputValue: string) => {
    if (required && !inputValue) {
      setError(`${label} wajib diisi`);
      setValid(false);
      return;
    }
    
    if (minLength && inputValue.length < minLength) {
      setError(`${label} minimal ${minLength} karakter`);
      setValid(false);
      return;
    }
    
    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
      setError("Format email tidak valid");
      setValid(false);
      return;
    }
    
    if (validation && validation.patternString) {
      // Convert string pattern to RegExp on the client side
      const pattern = new RegExp(validation.patternString);
      if (!pattern.test(inputValue)) {
        setError(validation.message || `Format ${label.toLowerCase()} tidak valid`);
        setValid(false);
        return;
      }
    }
    
    setError(null);
    setValid(inputValue.length > 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (touched) {
      validate(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(value);
  };

  return (
    <div className="space-y-1">
      <Label 
        htmlFor={name} 
        className="text-sm font-medium text-gray-900 flex justify-between"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          minLength={minLength}
          className={`
            pr-10 w-full border-violet-200 
            focus:border-violet-600 focus:ring-violet-600 
            rounded-md ${error ? "border-red-300" : ""} 
            ${valid ? "border-green-300" : ""} 
            ${className}
          `}
        />
        
        {touched && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {error ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : valid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {touched && error && (
        <p className="text-xs text-red-500 mt-1 animate-in fade-in-50 slide-in-from-bottom-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};