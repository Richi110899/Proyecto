"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API_MED = "http://localhost:3001/api/medicamentos";
const API_ESP = "http://localhost:3001/api/especialidades";
const API_TIPO = "http://localhost:3001/api/tipos";

const initialState = {
  descripcionMed: '',
  fechaFabricacion: '',
  fechaVencimiento: '',
  Presentacion: '',
  stock: '',
  precioVentaUni: '',
  precioVentaPres: '',
  CodTipoMed: '',
  Marca: '',
  CodEspec: ''
};

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

export default function EditarMedicamento() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState(initialState);
  const [especialidades, setEspecialidades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(API_ESP).then(r => r.json()).then(setEspecialidades);
    fetch(API_TIPO).then(r => r.json()).then(setTipos);
    if (id) {
      fetch(`${API_MED}/${id}`)
        .then(r => r.json())
        .then(data => {
          setForm({
            ...data,
            fechaFabricacion: data.fechaFabricacion?.slice(0,10) || '',
            fechaVencimiento: data.fechaVencimiento?.slice(0,10) || ''
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
    if (form.fechaFabricacion && form.fechaVencimiento) {
      const fab = new Date(form.fechaFabricacion);
      const ven = new Date(form.fechaVencimiento);
      if (ven < fab) {
        setError('La fecha de vencimiento no puede ser menor a la fecha de fabricación.');
        return;
      }
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_MED}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        router.push('/medicamentos?edit=success');
      } else {
        setError('Error al actualizar el medicamento');
      }
    } catch {
      setError('Error al actualizar el medicamento');
    }
    setLoading(false);
  };
  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Editar Medicamento</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
        {error && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          {/* Fila 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            <Input label="Nombre" name="descripcionMed" value={form.descripcionMed} onChange={handleChange} required />
            <Input label="Presentación" name="Presentacion" value={form.Presentacion} onChange={handleChange} required />
            <Input label="Marca" name="Marca" value={form.Marca} onChange={handleChange} required />
          </div>
          {/* Fila 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            <FloatingSelect label="Especialidad" name="CodEspec" value={form.CodEspec} onChange={handleChange} required>
              <option value="" disabled hidden></option>
              {especialidades.map(e => (
                <option key={e.CodEspec} value={e.CodEspec}>{e.descripcionEsp}</option>
              ))}
            </FloatingSelect>
            <FloatingSelect label="Tipo de medicamento" name="CodTipoMed" value={form.CodTipoMed} onChange={handleChange} required>
              <option value="" disabled hidden></option>
              {tipos.map(t => (
                <option key={t.CodTipoMed} value={t.CodTipoMed}>{t.descripcion}</option>
              ))}
            </FloatingSelect>
            <Input label="Stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
          </div>
          {/* Fila 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
            <Input label="Precio Venta Unidad" name="precioVentaUni" type="number" step="0.01" min="0" value={form.precioVentaUni} onChange={handleChange} required />
            <Input label="Precio Venta Presentación" name="precioVentaPres" type="number" step="0.01" min="0" value={form.precioVentaPres} onChange={handleChange} required />
            <Input label="Fecha de fabricación" name="fechaFabricacion" type="date" value={form.fechaFabricacion} onChange={handleChange} required />
            <Input label="Fecha de vencimiento" name="fechaVencimiento" type="date" value={form.fechaVencimiento} onChange={handleChange} required />
          </div>
          {/* Fila 4: Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              onClick={() => router.push('/medicamentos')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !form.descripcionMed?.trim()}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 