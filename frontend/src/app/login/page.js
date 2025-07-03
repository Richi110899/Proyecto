import AuthButton from "@/components/AuthButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center from-blue-100 via-white to-violet-100">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-slate-100 max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-700 tracking-tight text-center">Bienvenido a PibuFarma</h1>
        <AuthButton />
      </div>
    </div>
  );
} 