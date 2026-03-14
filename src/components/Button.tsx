type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export function Button({
  children, onClick, disabled,
  variant = 'primary', fullWidth = false, type = 'button'
}: ButtonProps) {
  const base =
    'py-3 px-6 rounded-xl font-medium transition-colors active:scale-95 text-base flex items-center justify-center gap-2 ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400';
  const variants = {
    primary:   'bg-[#00B900] text-white disabled:opacity-40 active:bg-[#009900]',
    secondary: 'bg-gray-200 text-gray-800 active:bg-gray-300',
    danger:    'bg-red-500 text-white disabled:opacity-40 active:bg-red-600',
    ghost:     'bg-transparent text-gray-600 active:bg-gray-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}