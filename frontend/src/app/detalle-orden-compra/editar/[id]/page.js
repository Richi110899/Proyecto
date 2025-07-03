"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { getDetallesOrdenCompra, getOrdenesCompra, getMedicamentos, updateDetalleOrdenCompra, addDetalleOrdenCompra, deleteDetalleOrdenCompra } from '@/services/api';

const Input = ({ label, name, type = "text", value, onChange, readOnly, ...props }) => {
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
          "placeholder-transparent focus:outline-none focus:border-blue-600 " +
          (readOnly ? "bg-gray-100 cursor-not-allowed" : "")
        }
        placeholder={label}
        autoComplete="off"
        readOnly={readOnly}
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

const FloatingSelect = ({ label, name, value, onChange, children, readOnly, ...props }) => {
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
        className={
          "peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent focus:outline-none focus:border-blue-600 text-sm appearance-none pl-3 " +
          (readOnly ? "bg-gray-100 cursor-not-allowed" : "")
        }
        required
        disabled={readOnly}
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

export default function EditarDetalleOrdenCompraPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [nroOrden, setNroOrden] = useState("");
  const [detalles, setDetalles] = useState([]); // todos los detalles de la orden
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [detallesAll, meds] = await Promise.all([
        getDetallesOrdenCompra(),
        getMedicamentos()
      ]);
      const detalle = detallesAll.find(d => String(d.id) === String(id));
      if (!detalle) {
        setError("Detalle no encontrado");
        return;
      }
      setNroOrden(detalle.NroOrdenC);
      // Filtrar todos los detalles de la misma orden
      setDetalles(detallesAll.filter(d => d.NroOrdenC === detalle.NroOrdenC));
      setMedicamentos(meds);
    }
    fetchData();
  }, [id]);

  const handleDetalleChange = (idx, field, value) => {
    setDetalles(detalles => detalles.map((d, i) => {
      if (i !== idx) return d;
      let newDetalle = { ...d, [field]: value };
      if (field === "cantidad" || field === "precio") {
        const cantidad = field === "cantidad" ? value : d.cantidad;
        const precio = field === "precio" ? value : d.precio;
        newDetalle.montouni = Number(cantidad) * Number(precio);
      }
      return newDetalle;
    }));
  };

  const handleAddDetalle = () => {
    setDetalles([...detalles, { id: undefined, NroOrdenC: nroOrden, CodMedicamento: "", descripcion: "", cantidad: "", precio: "", montouni: 0 }]);
  };

  const handleRemoveDetalle = async (idx) => {
    const detalle = detalles[idx];
    if (detalle.id) {
      setLoading(true);
      try {
        await deleteDetalleOrdenCompra(detalle.id);
        if (typeof window !== 'undefined') {
          localStorage.setItem('detalleOrdenCompraMensaje', 'Detalle de orden de compra eliminado');
        }
      } catch {}
      setLoading(false);
    }
    setDetalles(detalles => detalles.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    for (let i = 0; i < detalles.length; i++) {
      const d = detalles[i];
      if (!d.CodMedicamento || !d.descripcion.trim() || !d.cantidad || !d.precio) {
        setError(`Completa todos los campos para el medicamento #${i + 1}`);
        return;
      }
      if (Number(d.cantidad) <= 0 || Number(d.precio) < 0) {
        setError(`Cantidad y precio deben ser mayores a 0 para el medicamento #${i + 1}`);
        return;
      }
    }
    setLoading(true);
    try {
      for (const d of detalles) {
        if (d.id) {
          await updateDetalleOrdenCompra(d.id, {
            NroOrdenC: Number(nroOrden),
            CodMedicamento: Number(d.CodMedicamento),
            descripcion: d.descripcion,
            cantidad: Number(d.cantidad),
            precio: Number(d.precio),
            montouni: Number(d.montouni)
          });
        } else {
          await addDetalleOrdenCompra({
            NroOrdenC: Number(nroOrden),
            CodMedicamento: Number(d.CodMedicamento),
            descripcion: d.descripcion,
            cantidad: Number(d.cantidad),
            precio: Number(d.precio),
            montouni: Number(d.montouni)
          });
        }
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('detalleOrdenCompraMensaje', 'Detalles de orden de compra editados exitosamente');
      }
      router.push('/detalle-orden-compra');
    } catch {
      setError("Error al editar los detalles de orden de compra");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Editar Detalles de Orden de Compra</h1>
      </div>
      <div className="pt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
          {error && (
            <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-left">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              <Input
                label="Orden de Compra"
                name="NroOrdenC"
                value={nroOrden ? String(nroOrden).padStart(3, '0') : ''}
                readOnly
              />
            </div>
            <div>
              {detalles.map((detalle, idx) => (
                <div key={idx} className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
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
                        label="Descripción"
                        name="descripcion"
                        value={detalle.descripcion}
                        onChange={e => handleDetalleChange(idx, 'descripcion', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Cantidad"
                        name="cantidad"
                        type="number"
                        value={detalle.cantidad}
                        onChange={e => handleDetalleChange(idx, 'cantidad', e.target.value)}
                        min={1}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Precio"
                        name="precio"
                        type="number"
                        value={detalle.precio}
                        onChange={e => handleDetalleChange(idx, 'precio', e.target.value)}
                        min={0}
                        step={0.01}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Monto Unitario"
                        name="montouni"
                        type="number"
                        value={detalle.montouni}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-0.5">
                    {detalles.length > 1 && (
                      <button type="button" onClick={() => handleRemoveDetalle(idx)} className="h-9 px-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all text-xs font-semibold flex items-center">Eliminar</button>
                    )}
                    {idx === detalles.length - 1 && (
                      <button type="button" onClick={handleAddDetalle} className="h-9 px-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all text-xs font-semibold flex items-center">+ Agregar</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                onClick={() => router.push('/detalle-orden-compra')}
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