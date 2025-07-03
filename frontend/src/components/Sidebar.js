'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { signOut } from "next-auth/react";

const menu = [
  {
    label: 'Venta',
    color: 'emerald',
    sub: [
      { label: 'Orden de Venta', href: '/ordenes-venta' },
      { label: 'Detalle de Venta', href: '/detalle-orden-venta' },
    ],
  },
  {
    label: 'Compra',
    color: 'blue',
    sub: [
      { label: 'Orden de Compra', href: '/ordenes-compra' },
      { label: 'Detalle de Compra', href: '/detalle-orden-compra' },
    ],
  },
  {
    label: 'Catálogos',
    color: 'violet',
    sub: [
      { label: 'Medicamentos', href: '/medicamentos' },
      { label: 'Laboratorios', href: '/laboratorios' },
      { label: 'Tipos de Medicamento', href: '/medicamentos/tipos' },
      { label: 'Especialidades', href: '/medicamentos/especialidades' },
    ],
  },
  // Descomenta esta sección si quieres mostrar Reportes
  // {
  //   label: 'Reportes',
  //   color: 'orange',
  //   sub: [
  //     { label: 'Reporte de Stock', href: '/reportes/stock' },
  //     { label: 'Reporte de Ventas', href: '/reportes/ventas' },
  //     { label: 'Reporte de Compras', href: '/reportes/compras' },
  //   ],
  // },
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    hover: 'hover:bg-emerald-100',
    icon: 'text-emerald-600'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    hover: 'hover:bg-blue-100',
    icon: 'text-blue-600'
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    hover: 'hover:bg-violet-100',
    icon: 'text-violet-600'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    hover: 'hover:bg-orange-100',
    icon: 'text-orange-600'
  }
};

export default function Sidebar() {
  const [open, setOpen] = useState({});

  const toggle = (label) => {
    setOpen((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-20 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <Link href="/" className="focus:outline-none group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-blue-600 text-xl font-bold">PF</span>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-white tracking-wide">PibuFarma</h1>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {menu.map((item) => {
          const colors = colorClasses[item.color];
          
          return (
            <div key={item.label} className="relative">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  open[item.label] 
                    ? `${colors.bg} ${colors.border} border-2 shadow-md` 
                    : 'hover:bg-slate-100 border-2 border-transparent'
                }`}
                onClick={() => toggle(item.label)}
                aria-expanded={open[item.label] ? 'true' : 'false'}
              >
                <div className="flex-1 text-left">
                  <span className={`font-semibold text-sm ${open[item.label] ? colors.text : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.sub.length} opciones
                  </div>
                </div>

                <div className={`transition-transform duration-300 ${open[item.label] ? 'rotate-90' : ''}`}>
                  <FiChevronRight className={`text-lg ${open[item.label] ? colors.icon : 'text-slate-400'}`} />
                </div>
              </button>

              {/* Submenu */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open[item.label] ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`ml-4 pl-4 border-l-2 ${colors.border} space-y-1`}>
                  {item.sub.map((sub) => {
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-slate-700 ${colors.hover} hover:shadow-sm transition-all duration-200 group`}
                      >
                        <div>
                          <div className="font-medium text-sm">{sub.label}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
      {/* Botón de Cerrar sesión */}
      <div className="p-4 border-t border-slate-200 mt-auto">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl brder-2 border-red-200 text-red-700 font-semibold hover:bg-red-100 hover:shadow transition-all duration-200 focus:outline-none"
        >
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}