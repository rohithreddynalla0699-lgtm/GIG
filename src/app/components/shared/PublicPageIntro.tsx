interface PublicPageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function PublicPageIntro({ eyebrow, title, description }: PublicPageIntroProps) {
  return (
    <div className="mb-7 max-w-[760px] md:mb-9">
      <div className="eyebrow mb-3">{eyebrow}</div>
      <h1 className="page-title mb-3 max-w-[12ch]">{title}</h1>
      <p className="body-large max-w-[60ch]">{description}</p>
    </div>
  );
}
