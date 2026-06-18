type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
};

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <div className="border-b border-bg-alt bg-bg-light py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-accent">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-bold text-text-dark md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-3xl text-lg leading-8 text-text-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
