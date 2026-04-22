import { JSX } from "solid-js/jsx-runtime";

// src/ui/shared/Input.tsx
export const Input = (props: JSX.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
      {...props} 
      class="h-10 border border-slate-300 rounded-md px-3 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 w-full" 
    />
  );
};