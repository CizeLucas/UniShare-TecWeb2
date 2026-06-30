export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-container-padding bg-background antialiased">
      {children}
    </div>
  );
}