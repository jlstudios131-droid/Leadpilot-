import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Input({ icon: Icon, label, error, id, className, ...rest }) {
  const inputBaseClasses = clsx(
    'input', 
    'pl-10 pr-3 py-2 text-base border-muted-300 transition-all', 
    {
      'border-danger-500 focus:ring-danger-500': error,
    }
  );

  return (
    <div className={twMerge("w-full", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon 
              className={clsx(
                'w-5 h-5',
                {'text-danger-500': error, 'text-muted-400': !error}
              )} 
            />
          </div>
        )}
        
        <input
          id={id}
          name={id}
          className={inputBaseClasses}
          {...rest}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
      }
