interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const colorClasses = {
  primary: 'border-slate-700 border-t-slate-500',
  white: 'border-white border-t-slate-200'
};

export const Loading = ({ size = 'md', color = 'primary' }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-2
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Carregando...</span>
      </div>
    </div>
  );
};
