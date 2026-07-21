const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">

      {children}
    </div>
  );
};

export default AuthLayout;

       