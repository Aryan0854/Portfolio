import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'left',
}) => {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignment} gap-3 mb-12 sm:mb-14`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white tracking-tight leading-tight">
        {title}
        {highlight && (
          <>
            {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
              {highlight}
            </span>
          </>
        )}
      </h2>
      <div className="h-px w-14 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" />
      {subtitle && (
        <p className="text-sm sm:text-[15px] text-slate-400 leading-relaxed max-w-xl font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
