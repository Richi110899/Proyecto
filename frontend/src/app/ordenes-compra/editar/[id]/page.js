"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { updateOrdenCompra, getLaboratorios } from '@/services/api';

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

const FloatingSelect = ({ label, name, value, onChange, children, ...props }) => {
  const [focused, setFocused] = React.useState(false);
  const hasValue = value && value !== "";
  return (
    <div className="relative mb-8">
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent focus:outline-none focus:border-blue-600 text-sm appearance-none pl-3"
        required
        {...props}
      >
        <option value="" disabled hidden></option>
        {children}
      </select>
      <label
        htmlFor={name}
        className={
          "absolute left-0 transition-all pointer-events-none " +
          ((focused || hasValue)
            ? "-top-3.5 text-sm text-blue-600"
            : "top-3.5 text-sm text-gray-400")
        }
      >
        {label}
      </label>
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
    </div>
  );
};

const campos = [
  { key: "fechaEmision", label: "Fecha de Emisión", type: "date" },
  { key: "Situacion", label: "Situación" },
  { key: "Total", label: "Total", type: "number", step: "0.01", min: "0" },
  { key: "NrofacturaProv", label: "N° Factura Proveedor" },
];

export default function EditarOrdenCompraPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [form, setForm] = useState({ fechaEmision: "", Situacion: "", Total: "", CodLab: "", NrofacturaProv: "" });
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setCargando(true);
      try {
        const [res, labs] = await Promise.all([
          fetch(`http://localhost:3001/api/ordenes-compra/${id}`),
          getLaboratorios()
        ]);
        const data = await res.json();
        setForm({
          fechaEmision: data.fechaEmision ? data.fechaEmision.slice(0,10) : "",
          Situacion: data.Situacion || "",
          Total: data.Total || "",
          CodLab: data.CodLab ? String(data.CodLab) : "",
          NrofacturaProv: data.NrofacturaProv || ""
        });
        setLaboratorios(labs);
      } catch {
        setError("Error al cargar la orden de compra");
      }
      setCargando(false);
    }
    fetchData();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.fechaEmision || !form.Situacion.trim() || !form.Total || !form.CodLab) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res = await updateOrdenCompra(id, {
        ...form,
        CodLab: Number(form.CodLab),
        Total: Number(form.Total)
      });
      if (res && res.NroOrdenC) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('ordenCompraMensaje', 'Orden de compra editada exitosamente');
        }
        router.push('/ordenes-compra');
      } else {
        setError("Error al editar la orden de compra");
      }
    } catch {
      setError("Error al editar la orden de compra");
    }
    setLoading(false);
  };

  if (cargando) {
    return (
      <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 text-sm">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Editar Orden de Compra</h1>
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
                  required={campo.key !== 'NrofacturaProv'}
                  type={campo.type || 'text'}
                  step={campo.step}
                  min={campo.min}
                />
              ))}
              <FloatingSelect
                label="Laboratorio"
                name="CodLab"
                value={form.CodLab}
                onChange={handleChange}
              >
                {laboratorios.map(lab => (
                  <option key={lab.CodLab} value={lab.CodLab}>{lab.razonSocial}</option>
                ))}
              </FloatingSelect>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                onClick={() => router.push('/ordenes-compra')}
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
    </div>
  );
} 