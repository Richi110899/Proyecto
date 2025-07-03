"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API_ORDENES = "http://localhost:3001/api/ordenes-venta";

const Input = ({ label, name, type = "text", value, onChange, ...props }) => {
  const isDate = type === 'date';
  const [focused, setFocused] = useState(false);
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
          "peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent text-sm " +
          "placeholder-transparent focus:outline-none focus:border-blue-600"
        }
        placeholder={isDate ? " " : label}
        autoComplete="off"
        {...props}
      />
      <label
        htmlFor={name}
        className={
          "absolute left-0 transition-all pointer-events-none -top-3.5 text-sm " +
          (isDate
            ? ((focused || (value && value !== "")) ? "text-blue-600" : "text-gray-400")
            : "text-blue-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 -top-3.5 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm")
        }
      >
        {label}
      </label>
    </div>
  );
};

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

export default function EditarOrdenVenta() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({ fechaEmision: '', Motivo: '', Situacion: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`${API_ORDENES}/${id}`)
        .then(r => r.json())
        .then(data => {
          setForm({
            fechaEmision: data.fechaEmision?.slice(0,10) || '',
            Motivo: data.Motivo || '',
            Situacion: data.Situacion || ''
          });
        });
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.fechaEmision || !form.Motivo.trim() || !form.Situacion.trim()) {
      setError('Completa todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_ORDENES}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('ordenesVentaMensaje', 'Orden de venta actualizada exitosamente');
        }
        router.push(`/ordenes-venta`);
      } else {
        setError('Error al actualizar la orden de venta');
      }
    } catch {
      setError('Error al actualizar la orden de venta');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Editar Orden de Venta</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
        {error && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            <Input label="Fecha de Emisión" name="fechaEmision" type="date" value={form.fechaEmision} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <FloatingTextarea label="Motivo" name="Motivo" value={form.Motivo} onChange={handleChange} placeholder="Motivo" />
            <FloatingTextarea label="Situación" name="Situacion" value={form.Situacion} onChange={handleChange} placeholder="Situación" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              onClick={() => router.push(`/ordenes-venta`)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 