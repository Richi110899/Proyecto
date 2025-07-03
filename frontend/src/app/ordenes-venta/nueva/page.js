"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_ORDENES = "http://localhost:3001/api/ordenes-venta";

// Floating label input reutilizable con color dinámico
const Input = ({ label, name, type = "text", value, onChange, ...props }) => {
  const isDate = type === 'date';
  const [focused, setFocused] = useState(false);
  const isActive = focused || (value && value !== "");
  return (
    <div className="relative mb-8">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={isDate ? () => setFocused(true) : undefined}
        onBlur={isDate ? () => setFocused(false) : undefined}
        className={
          "peer h-12 w-full border-b-2 text-gray-900 bg-transparent text-sm placeholder-transparent focus:outline-none " +
          (isActive ? "border-blue-600" : "border-gray-300")
        }
        placeholder={isDate ? " " : label}
        autoComplete="off"
        {...props}
      />
      <label
        htmlFor={name}
        className={
          "absolute left-0 transition-all pointer-events-none " +
          (isDate
            ? ((focused || (value && value !== "")) ? "-top-3.5 text-sm text-blue-600" : "top-3.5 text-sm text-gray-400")
            : (isActive
                ? "-top-3.5 text-sm text-blue-600"
                : "top-3.5 text-sm text-gray-400"))
        }
      >
        {label}
      </label>
    </div>
  );
};

// Floating label textarea
const FloatingTextarea = ({ label, name, value, onChange, ...props }) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || (value && value !== "");
  return (
    <div className="relative mb-4">
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={
          `peer h-12 w-full border-b-2 text-gray-900 bg-transparent text-sm placeholder-transparent focus:outline-none resize-y py-3 ` +
          (isActive ? "border-blue-600" : "border-gray-300")
        }
        placeholder={label}
        autoComplete="off"
        rows={1}
        {...props}
      />
      <label
        htmlFor={name}
        className={
          `absolute left-0 transition-all pointer-events-none ` +
          (isActive
            ? "-top-3.5 text-sm text-blue-600"
            : "top-3.5 text-sm text-gray-400")
        }
      >
        {label}
      </label>
    </div>
  );
};

export default function NuevaOrdenVentaPage() {
  const router = useRouter();
  // Fecha actual en formato yyyy-mm-dd
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const defaultFecha = `${yyyy}-${mm}-${dd}`;
  const [fechaEmision, setFechaEmision] = useState(defaultFecha);
  const [motivo, setMotivo] = useState("");
  const [motivos, setMotivos] = useState([]);
  const [situacion, setSituacion] = useState("");
  const [situaciones, setSituaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mensaje de éxito desaparece a los 3 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje("") , 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    if (!fechaEmision || !motivo.trim() || !situacion.trim()) {
      setError("Completa todos los campos y agrega al menos un motivo y una situación.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(API_ORDENES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaEmision,
          Motivo: motivo,
          Situacion: situacion,
        }),
      });
      if (!res.ok) throw new Error("Error al crear la orden");
      setMensaje("Orden de venta creada exitosamente.");
      setMotivo("");
      setSituacion("");
    } catch (err) {
      setError("Error al crear la orden de venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Nueva Orden de Venta</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
        {mensaje && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left">{mensaje}</div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8 mt-3">
          {/* Fila 1: Fecha alineada a la izquierda y ancho 1/3 en desktop, label siempre arriba y azul */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            <div className="w-full">
              <div className="mb-8">
                <label htmlFor="fechaEmision" className="block mb-1 text-sm font-medium text-blue-600">Fecha de Emisión</label>
                <input
                  type="date"
                  name="fechaEmision"
                  id="fechaEmision"
                  value={fechaEmision}
                  onChange={e => setFechaEmision(e.target.value)}
                  className="h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent text-sm focus:outline-none focus:border-blue-600 rounded-none"
                  required
                />
              </div>
            </div>
          </div>
          {/* Fila 2: Motivo y Situación en la misma fila */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {/* Motivo */}
            <div>
              <FloatingTextarea
                label="Motivo"
                name="motivo"
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Motivo"
              />
            </div>
            {/* Situación */}
            <div>
              <FloatingTextarea
                label="Situación"
                name="situacion"
                value={situacion}
                onChange={e => setSituacion(e.target.value)}
                placeholder="Situación"
              />
            </div>
          </div>
          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              onClick={() => router.push('/ordenes-venta')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
