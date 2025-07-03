"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from 'swr';

const API_DETALLES = "http://localhost:3001/api/detalles-venta";
const API_MEDICAMENTOS = "http://localhost:3001/api/medicamentos";
const API_ORDENES = "http://localhost:3001/api/ordenes-venta";

const Input = ({ label, name, type = "text", value, onChange, ...props }) => {
  const isDate = type === 'date';
  const [focused, setFocused] = React.useState(false);
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

const fetcher = url => fetch(url).then(r => r.json());

export default function NuevoDetalleOrdenVenta() {
  const router = useRouter();
  // SWR para órdenes de venta
  const { data: ordenes = [], isLoading: loadingOrdenes } = useSWR(API_ORDENES, fetcher);
  const [detallesExistentes, setDetallesExistentes] = useState([]);
  const [nroOrden, setNroOrden] = useState("");
  const [detalles, setDetalles] = useState([
    { CodMedicamento: "", descripcionMed: "", cantidadRequerida: "", stock: null }
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // SWR para medicamentos
  const { data: medicamentos = [], isLoading: loadingMeds } = useSWR(API_MEDICAMENTOS, fetcher);

  useEffect(() => {
    fetch(API_DETALLES).then(r => r.json()).then(setDetallesExistentes);
  }, []);

  // Actualiza el stock y descripción al seleccionar medicamento
  const handleDetalleChange = (idx, field, value) => {
    setDetalles(detalles => detalles.map((d, i) => {
      if (i !== idx) return d;
      if (field === "CodMedicamento") {
        const med = medicamentos.find(m => m.CodMedicamento == value);
        return {
          ...d,
          CodMedicamento: value,
          stock: med ? med.stock : null,
          cantidadRequerida: ""
        };
      }
      return { ...d, [field]: value };
    }));
  };

  const handleAddDetalle = () => {
    setDetalles([...detalles, { CodMedicamento: "", descripcionMed: "", cantidadRequerida: "", stock: null }]);
  };

  const handleRemoveDetalle = (idx) => {
    setDetalles(detalles => detalles.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!nroOrden) {
      setError("Selecciona una orden de venta.");
      return;
    }
    for (let i = 0; i < detalles.length; i++) {
      const d = detalles[i];
      if (!d.CodMedicamento || !d.descripcionMed.trim() || !d.cantidadRequerida) {
        setError(`Completa todos los campos para el medicamento #${i + 1}`);
        return;
      }
      if (Number(d.cantidadRequerida) > Number(d.stock)) {
        const med = medicamentos.find(m => m.CodMedicamento == d.CodMedicamento);
        setError(`La cantidad requerida para el medicamento "${med ? med.descripcionMed : 'Desconocido'}" supera el stock disponible.`);
        return;
      }
    }
    setLoading(true);
    try {
      const payload = detalles.map(d => ({
        NroOrdenVta: Number(nroOrden),
        CodMedicamento: Number(d.CodMedicamento),
        descripcionMed: d.descripcionMed,
        cantidadRequerida: Number(d.cantidadRequerida)
      }));
      const res = await fetch(API_DETALLES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('detalleOrdenVentaMensaje', 'Detalles de orden de venta creados exitosamente');
        }
        mutate(API_ORDENES); // Actualiza la lista de órdenes en todas las páginas
        router.push('/detalle-orden-venta');
      } else {
        setError('Error al crear los detalles de orden de venta');
      }
    } catch {
      setError('Error al crear los detalles de orden de venta');
    }
    setLoading(false);
  };

  // Obtén los NroOrdenVta ya usados
  const usados = new Set(detallesExistentes.map(d => d.NroOrdenVta));

  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Nuevo Detalle de Orden de Venta</h1>
      </div>
      <div className="pt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
          {error && (
            <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-left">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4 mb-8">
              <div>
                <FloatingSelect
                  label="Orden de Venta"
                  name="NroOrdenVta"
                  value={nroOrden}
                  onChange={e => setNroOrden(e.target.value)}
                >
                  {ordenes
                    .filter(o => !usados.has(o.NroOrdenVta))
                    .map(o => (
                      <option key={o.NroOrdenVta} value={o.NroOrdenVta}>{String(o.NroOrdenVta).padStart(3, '0')}</option>
                    ))}
                </FloatingSelect>
              </div>
            </div>
            <div>
              {detalles.map((detalle, idx) => (
                <div key={idx} className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                    <div>
                      <FloatingSelect
                        label="Medicamento"
                        name="CodMedicamento"
                        value={detalle.CodMedicamento}
                        onChange={e => handleDetalleChange(idx, 'CodMedicamento', e.target.value)}
                      >
                        {medicamentos
                          .filter(med => {
                            const yaSeleccionado = detalles.some((d, i) => i !== idx && d.CodMedicamento == med.CodMedicamento);
                            return !yaSeleccionado;
                          })
                          .map(m => (
                            <option key={m.CodMedicamento} value={m.CodMedicamento}>{m.descripcionMed}</option>
                          ))}
                      </FloatingSelect>
                    </div>
                    <div>
                      <Input
                        label="Cantidad"
                        name="cantidadRequerida"
                        type="number"
                        value={detalle.cantidadRequerida}
                        onChange={e => handleDetalleChange(idx, 'cantidadRequerida', e.target.value)}
                        min={1}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Descripción médica"
                        name="descripcionMed"
                        value={detalle.descripcionMed}
                        onChange={e => handleDetalleChange(idx, 'descripcionMed', e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-2 items-start pt-1">
                      {detalles.length > 1 && (
                        <button type="button" onClick={() => handleRemoveDetalle(idx)} className="h-9 px-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all text-xs font-semibold flex items-center">Eliminar</button>
                      )}
                      {idx === detalles.length - 1 && (
                        <button type="button" onClick={handleAddDetalle} className="h-9 px-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all text-xs font-semibold flex items-center">+ Agregar</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                onClick={() => router.push('/detalle-orden-venta')}
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