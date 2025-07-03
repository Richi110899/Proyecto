"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { addLaboratorio } from '../../../services/api';

const Input = ({ label, name, type = "text", value, onChange, ...props }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div className="relative mb-8">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={
          "peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent text-sm " +
          "placeholder-transparent focus:outline-none focus:border-blue-600"
        }
        placeholder={label}
        autoComplete="off"
        {...props}
      />
      <label
        htmlFor={name}
        className={
          "absolute left-0 transition-all pointer-events-none -top-3.5 text-sm " +
          (focused || (value && value !== "")
            ? "text-blue-600"
            : "text-blue-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 -top-3.5 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm")
        }
      >
        {label}
      </label>
    </div>
  );
};

const campos = [
  { key: "razonSocial", label: "Razón Social" },
  { key: "direccion", label: "Dirección" },
  { key: "telefono", label: "Celular", type: "tel", pattern: "^9\\d{8}$", title: "Debe ser un número móvil peruano (9 dígitos, empieza con 9)" },
  { key: "email", label: "Email", type: "email" },
  { key: "contacto", label: "Contacto" },
];

export default function NuevoLaboratorioPage() {
  const router = useRouter();
  const [form, setForm] = useState({ razonSocial: "", direccion: "", telefono: "", email: "", contacto: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    if (e.target.name === 'telefono') {
      // Solo permitir números
      const soloNumeros = e.target.value.replace(/[^0-9]/g, '');
      setForm({ ...form, telefono: soloNumeros });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.razonSocial.trim()) {
      setError("La razón social es obligatoria");
      return;
    }
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("El email no es válido");
      return;
    }
    if (form.telefono && (!/^[0-9]{9}$/.test(form.telefono) || !/^9\d{8}$/.test(form.telefono))) {
      setError("El celular debe ser un número móvil peruano válido (9 dígitos, empieza con 9)");
      return;
    }
    setLoading(true);
    try {
      const res = await addLaboratorio(form);
      if (res && res.CodLab) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('laboratorioMensaje', 'Laboratorio creado exitosamente');
        }
        router.push('/laboratorios');
      } else {
        setError("Error al crear el laboratorio");
      }
    } catch {
      setError("Error al crear el laboratorio");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Nuevo Laboratorio</h1>
      </div>
      <div className="pt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
          {error && (
            <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-left">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {campos.map(campo => (
                <Input
                  key={campo.key}
                  label={campo.label}
                  name={campo.key}
                  value={form[campo.key]}
                  onChange={handleChange}
                  required={campo.key === 'razonSocial'}
                  type={campo.type || 'text'}
                  pattern={campo.pattern}
                  title={campo.title}
                  inputMode={campo.key === 'telefono' ? 'numeric' : undefined}
                />
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                onClick={() => router.push('/laboratorios')}
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
    </div>
  );
} 