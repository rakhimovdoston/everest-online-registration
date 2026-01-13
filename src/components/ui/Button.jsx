const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full',
    secondary: 'bg-transparent border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full',
    text: 'text-slate-600 hover:text-slate-900 underline-offset-4 hover:underline disabled:opacity-50 disabled:cursor-not-allowed rounded-lg',
  };

  const sizeClasses = {
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
