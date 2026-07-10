type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
};

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <div className="border-b border-panel-border bg-surface-alt py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-heading">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-bold text-body-1 dark:text-heading md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-3xl text-lg leading-8 text-body-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
