"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_DETALLES = "http://localhost:3001/api/detalles-venta";
const API_ORDENES = "http://localhost:3001/api/ordenes-venta";
const API_MEDICAMENTO = "http://localhost:3001/api/medicamentos";

const columns = [
  { key: "id", label: "ID" },
  { key: "NroOrdenVta", label: "Nro Orden" },
  { key: "Medicamento", label: "Medicamento" },
  { key: "cantidadRequerida", label: "Cantidad" },
];

function DetalleModal({ detalle, onClose, onEdit, onDelete, eliminando, error, mensaje }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  
  if (!detalle) return null;
  
  // Mostrar todas las descripciones agrupadas
  const descripcionesStr = detalle.descripciones ? detalle.descripciones.join(', ') : '';
  const medicamentosStr = detalle.medicamentos ? detalle.medicamentos.join(', ') : '';
  const cantidadesStr = detalle.cantidades ? detalle.cantidades.join(', ') : '';

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">ID</div>
              <div className="text-gray-900 font-medium text-sm">{detalle.id}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Nro Orden</div>
              <div className="text-gray-900 font-medium text-sm">{String(detalle.NroOrdenVta).padStart(3, '0')}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div className="col-span-2">
              <div className="text-gray-400 text-sm mb-1">Medicamentos y Cantidades</div>
              <div className="max-h-52 overflow-y-auto border rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Medicamento</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Cantidad</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 text-gray-900">{detalle.Medicamento?.descripcionMed || detalle.descripcionMed || detalle.nombreMedicamento || ''}</td>
                      <td className="px-4 py-2 text-gray-900">{detalle.cantidadRequerida}</td>
                      <td className="px-4 py-2 text-gray-900">{detalle.descripcionMed}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
        {mensaje && <div className="mt-6 p-3 rounded bg-green-100 text-green-800 text-sm">{mensaje}</div>}
        {error && <div className="mt-6 p-3 rounded bg-red-100 text-red-800 text-sm">{error}</div>}
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ selected, onCancel, onConfirm, loading }) {
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
            ¿Estás seguro de que quieres eliminar el detalle de orden de venta ID "{String(selected?.id).padStart(3, '0')}"?
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

// Devuelve el número de orden con formato 000
function getOrdenLabel(nro) {
  return String(nro).padStart(3, '0');
}

// Devuelve el nombre del medicamento (si hay datos de medicamentos, aquí solo retorna el id o descripción si existiera)
function getMedicamentoLabel(cod) {
  // Si tienes un array de medicamentos, puedes buscar la descripción aquí
  return cod ? String(cod) : '';
}

export default function DetalleOrdenVentaPage() {
  const router = useRouter();
  const [detalles, setDetalles] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [filtro, setFiltro] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [modalError, setModalError] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchDetalles();
    if (typeof window !== 'undefined') {
      const msg = localStorage.getItem('detalleOrdenVentaMensaje');
      if (msg) {
        setMensajeGlobal(msg);
        localStorage.removeItem('detalleOrdenVentaMensaje');
        setTimeout(() => setMensajeGlobal(''), 3000);
      }
    }
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'detalleOrdenVentaMensaje' && e.newValue) {
        fetchDetalles();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const fetchDetalles = async () => {
    setLoading(true);
    try {
      const [detallesRes, ordenesRes] = await Promise.all([
        fetch(API_DETALLES),
        fetch(API_ORDENES)
      ]);
      const [detallesData, ordenesData] = await Promise.all([
        detallesRes.json(),
        ordenesRes.json()
      ]);

      setDetalles(detallesData);
      setOrdenes(ordenesData);
    } catch {
      setMensajeGlobal("Error al cargar los detalles de orden de venta");
    }
    setLoading(false);
  };

  // DEBUG: Ver estructura de los detalles
  if (detalles && detalles.length > 0) {
    console.log('Ejemplo de detalle:', detalles[0]);
  }

  // Verificar que detalles sea un array antes de agrupar
  const detallesArray = Array.isArray(detalles) ? detalles : [];
  
  // Mostrar detalles individuales para poder eliminar uno por uno
  const detallesFiltrados = detallesArray.filter(det => {
    const nroOrdenStr = String(det.NroOrdenVta).padStart(3, '0');
    return (
      columns.some(col => (det[col.key] || "").toString().toLowerCase().includes(filtro.toLowerCase())) ||
      getOrdenLabel(det.NroOrdenVta).toString().includes(filtro) ||
      getMedicamentoLabel(det.CodMedicamento).toLowerCase().includes(filtro.toLowerCase()) ||
      nroOrdenStr.includes(filtro)
    );
  });

  const handleRowClick = (detalle) => {
    setModalError("");
    setModalMensaje("");
    setDetalle(detalle);
  };

  const handleEdit = () => {
    if (detalle) {
      router.push(`/detalle-orden-venta/editar/${detalle.NroOrdenVta}`);
    }
  };

  const handleDelete = async () => {
    setEliminando(true);
    try {
      const res = await fetch(`${API_DETALLES}/${detalle.id}`, { method: "DELETE" });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('medicamentoMensaje', 'Stock actualizado');
        }
        setMensajeGlobal("Detalle de orden de venta eliminado exitosamente");
        setShowDeleteModal(false);
        setDetalle(null);
        fetchDetalles();
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setModalError("Error al eliminar el detalle de orden de venta");
      }
    } catch {
      setModalError("Error al eliminar el detalle de orden de venta");
    }
    setEliminando(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Detalles de Orden de Venta</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => router.push('/detalle-orden-venta/nuevo')}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Filtrar detalles..."
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
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">ID</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Nro Orden</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Medicamento</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center p-6 text-gray-500 text-sm">Cargando...</td></tr>
            ) : detallesFiltrados.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td></tr>
            ) : (
              detallesFiltrados.map((detalle) => (
                <tr key={detalle.id} className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => handleRowClick(detalle)}
                >
                  <td className="p-3 text-sm text-gray-800">{String(detalle.id).padStart(3, '0')}</td>
                  <td className="p-3 text-sm text-gray-800">{String(detalle.NroOrdenVta).padStart(3, '0')}</td>
                  <td className="p-3 text-sm text-gray-800">{detalle.Medicamento?.descripcionMed || detalle.descripcionMed || detalle.nombreMedicamento || ''}</td>
                  <td className="p-3 text-sm text-gray-800">{detalle.cantidadRequerida}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {detalle && !showDeleteModal && (
        <DetalleModal
          detalle={detalle}
          onClose={() => setDetalle(null)}
          onEdit={handleEdit}
          onDelete={() => setShowDeleteModal(true)}
          eliminando={eliminando}
          error={modalError}
          mensaje={modalMensaje}
        />
      )}
      {showDeleteModal && detalle && (
        <ConfirmDeleteModal
          selected={detalle}
          onCancel={() => { setShowDeleteModal(false); setDetalle(null); }}
          onConfirm={handleDelete}
          loading={eliminando}
        />
      )}
    </div>
  );
} 