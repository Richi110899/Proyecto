'use client';

import { FiMenu } from 'react-icons/fi';

export default function Header({ onMenuClick, sidebarOpen }) {
  return (
    <header className="w-full h-16 flex items-center justify-between px-8 bg-white border-b shadow-sm fixed left-0 top-0 z-10 md:ml-64">
      {/* Botón hamburguesa: visible en móvil o cuando sidebar está oculto */}
      <button
        className={`md:hidden ${sidebarOpen ? 'hidden' : ''} md:block`}
        onClick={onMenuClick}
      >
        <FiMenu size={28} />
      </button>
      <span className="text-xl font-semibold text-blue-800">PibuFarma</span>
      {/* Aquí puedes poner usuario, buscador, etc. */}
    </header>
  );
}