type Props = {
  children: React.ReactNode;
};
export const StickyWrapper = ({ children }: Props) => {
  return (
    <div className="hidden lg:block w-[368px] sticky self-start top-0">
      <div className="min-h[calc(100vh-48px)] sticky top-0 flex flex-col gap-y-4">
        {children}
      </div>
    </div>
  );
};
