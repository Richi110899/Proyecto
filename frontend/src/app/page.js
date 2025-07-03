import Link from 'next/link';
import { FiShoppingCart, FiClipboard, FiPackage, FiUsers, FiList, FiFileText, FiTag, FiTruck } from 'react-icons/fi';

const options = [
  {
    label: 'Órdenes de Venta',
    href: '/ordenes-venta',
    icon: <FiShoppingCart className="text-2xl text-emerald-600" />,
  },
  {
    label: 'Detalle de Venta',
    href: '/detalle-orden-venta',
    icon: <FiClipboard className="text-2xl text-emerald-500" />,
  },
  {
    label: 'Órdenes de Compra',
    href: '/ordenes-compra',
    icon: <FiTruck className="text-2xl text-blue-600" />,
  },
  {
    label: 'Detalle de Compra',
    href: '/detalle-orden-compra',
    icon: <FiFileText className="text-2xl text-blue-500" />,
  },
  {
    label: 'Medicamentos',
    href: '/medicamentos',
    icon: <FiPackage className="text-2xl text-violet-600" />,
  },
  {
    label: 'Laboratorios',
    href: '/laboratorios',
    icon: <FiUsers className="text-2xl text-violet-500" />,
  },
  {
    label: 'Tipos de Medicamento',
    href: '/medicamentos/tipos',
    icon: <FiTag className="text-2xl text-orange-500" />,
  },
  {
    label: 'Especialidades',
    href: '/medicamentos/especialidades',
    icon: <FiList className="text-2xl text-orange-400" />,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-slate-50 to-white pt-8 pb-10">
      <div className="w-full max-w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-slate-100">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-700 tracking-tight text-center">Bienvenido a PibuFarma</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
          Sistema profesional de gestión de medicamentos, laboratorios, compras y ventas para farmacias.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mx-auto">
          {options.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-6 group hover:scale-105 focus:outline-none"
            >
              <div className="mb-2">{opt.icon}</div>
              <span className="font-semibold text-slate-700 text-center group-hover:text-blue-700 text-lg">{opt.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}