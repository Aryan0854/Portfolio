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
    <div className={`mb-8 flex flex-col gap-3 sm:mb-14 ${alignment}`}>
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
        <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-[15px]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
