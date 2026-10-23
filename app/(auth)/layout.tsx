export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-[#f6f5fb] text-[#141b3c]">{children}</div>
  );
}