"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_ORDENES = "http://localhost:3001/api/ordenes-venta";

function DetalleModal({ orden, onClose, onEdit, onDelete, eliminando, error, mensaje }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  if (!orden) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Detalle de Orden de Venta</h2>
        <div className="space-y-8">
          {/* Fila 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Nro Orden</div>
              <div className="text-gray-900 font-medium text-sm">{String(orden.NroOrdenVta).padStart(3, '0')}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Fecha de Emisión</div>
              <div className="text-gray-900 font-medium text-sm">{orden.fechaEmision?.slice(0,10)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Motivo</div>
              <div className="text-gray-900 font-medium text-sm">{orden.Motivo}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Situación</div>
              <div className="text-gray-900 font-medium text-sm">{orden.Situacion}</div>
            </div>
          </div>
        </div>
        {/* Botones de acciones */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            disabled={eliminando}
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            disabled={eliminando}
          >
            {eliminando ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
        {mensaje && <div className="mt-6 p-3 rounded bg-green-100 text-green-800 text-sm text-left">{mensaje}</div>}
        {error && <div className="mt-6 p-3 rounded bg-red-100 text-red-800 text-sm">{error}</div>}
      </div>
    </div>
  );
}

function EditarModal({ orden, onClose, onSave, loading }) {
  const [form, setForm] = useState({ ...orden });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Editar Orden de Venta</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-8 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-blue-600">Fecha de Emisión</label>
              <input
                type="date"
                name="fechaEmision"
                value={form.fechaEmision?.slice(0,10) || ''}
                onChange={e => setForm({ ...form, fechaEmision: e.target.value })}
                className="h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent text-sm focus:outline-none focus:border-blue-600 rounded-none"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-blue-600">Motivo</label>
              <textarea
                name="Motivo"
                value={form.Motivo}
                onChange={e => setForm({ ...form, Motivo: e.target.value })}
                className="h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent text-sm focus:outline-none focus:border-blue-600 rounded-none resize-y py-3"
                rows={1}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-blue-600">Situación</label>
              <textarea
                name="Situacion"
                value={form.Situacion}
                onChange={e => setForm({ ...form, Situacion: e.target.value })}
                className="h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent text-sm focus:outline-none focus:border-blue-600 rounded-none resize-y py-3"
                rows={1}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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

function ConfirmDeleteModal({ orden, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onCancel}
        >
          ×
        </button>
        <div className="pr-8">
          <h2 className="text-base font-semibold mb-2 text-gray-800 mb-8">Confirmar Eliminación</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              ¿Estás seguro de que quieres eliminar la orden de venta "{String(orden?.NroOrdenVta).padStart(3, '0')}"?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Eliminando...
                </span>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdenesVentaPage() {
  const router = useRouter();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [filtro, setFiltro] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [modalError, setModalError] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrdenes();
    if (typeof window !== 'undefined') {
      const msg = localStorage.getItem('ordenesVentaMensaje');
      if (msg) {
        setMensajeGlobal(msg);
        localStorage.removeItem('ordenesVentaMensaje');
        setTimeout(() => setMensajeGlobal(''), 3000);
      }
    }
  }, []);

  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ORDENES);
      const data = await res.json();
      setOrdenes(data);
    } catch {
      setMensajeGlobal("Error al cargar las órdenes de venta");
    }
    setLoading(false);
  };

  const ordenesFiltradas = ordenes.filter(orden =>
    (orden.NroOrdenVta + "").includes(filtro) ||
    (orden.Motivo || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (orden.Situacion || "").toLowerCase().includes(filtro.toLowerCase())
  );

  const handleRowClick = async (orden) => {
    setModalError("");
    setModalMensaje("");
    setDetalle(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_ORDENES}/${orden.NroOrdenVta}`);
      const data = await res.json();
      setDetalle(data);
    } catch {
      setModalError("No se pudo cargar el detalle de la orden de venta");
    }
    setLoading(false);
  };

  const handleEdit = () => {
    if (detalle) {
      router.push(`/ordenes-venta/editar/${detalle.NroOrdenVta}`);
    }
  };

  const handleSaveEdit = async (form) => {
    setEliminando(true);
    try {
      const res = await fetch(`${API_ORDENES}/${form.NroOrdenVta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setMensajeGlobal("Orden de venta actualizada exitosamente");
        setShowEditModal(false);
        setEditando(null);
        setDetalle(null);
        fetchOrdenes();
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setModalError("Error al actualizar la orden de venta");
      }
    } catch {
      setModalError("Error al actualizar la orden de venta");
    }
    setEliminando(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditando(null);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setEliminando(true);
    try {
      const res = await fetch(`${API_ORDENES}/${detalle.NroOrdenVta}`, { method: "DELETE" });
      if (res.ok) {
        setMensajeGlobal("Orden de venta eliminada exitosamente");
        setShowDeleteModal(false);
        setDetalle(null);
        fetchOrdenes();
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setModalError("Error al eliminar la orden de venta");
      }
    } catch {
      setModalError("Error al eliminar la orden de venta");
    }
    setEliminando(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Órdenes de Venta</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => router.push('/ordenes-venta/nueva')}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Filtrar órdenes..."
        className="mb-6 px-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      {mensajeGlobal && (
        <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left">{mensajeGlobal}</div>
      )}
      <div className="overflow-x-auto w-full shadow-md rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Nro Orden</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Fecha de emisión</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Motivo</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Situación</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center p-6 text-gray-500 text-sm">Cargando...</td></tr>
            ) : ordenes.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td></tr>
            ) : (
              ordenesFiltradas.map((orden) => (
                <tr key={orden.NroOrdenVta} className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => handleRowClick(orden)}
                >
                  <td className="p-3 text-sm text-gray-800">{String(orden.NroOrdenVta).padStart(3, '0')}</td>
                  <td className="p-3 text-sm text-gray-800">{orden.fechaEmision?.slice(0,10)}</td>
                  <td className="p-3 text-sm text-gray-800">{orden.Motivo}</td>
                  <td className="p-3 text-sm text-gray-800">{orden.Situacion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {detalle && !showDeleteModal && (
        <DetalleModal
          orden={detalle}
          onClose={() => setDetalle(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          eliminando={eliminando}
          error={modalError}
          mensaje={modalMensaje}
        />
      )}
      {showDeleteModal && detalle && (
        <ConfirmDeleteModal
          orden={detalle}
          onCancel={() => { setShowDeleteModal(false); setDetalle(null); }}
          onConfirm={handleConfirmDelete}
          loading={eliminando}
        />
      )}
    </div>
  );
} 