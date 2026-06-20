import React from 'react';
import { useId } from 'react';
import { cn } from '../../utils/system';
import { UI } from '../../constants/ui';

export const Input = React.memo(({ value, onChange, label, type = 'text', placeholder, isDark, className, inputClassName, required, id: idProp, autoComplete }) => {
  const autoId = useId();
  const inputId = idProp || autoId;

  return (
    <div className={cn('flex flex-col w-full gap-2.5', className)}>
      {label && <label htmlFor={inputId} className={UI.LABEL}>{label}</label>}
      <div className="relative group/input">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={cn(UI.INPUT, 'w-full', !isDark && 'bg-black/[0.05] border-black/10 text-zinc-950', inputClassName)}
        />
        <div className="absolute inset-0 rounded-xl ring-accent/20 transition-all pointer-events-none group-focus-within/input:ring-2" />
      </div>
    </div>
  );
});
