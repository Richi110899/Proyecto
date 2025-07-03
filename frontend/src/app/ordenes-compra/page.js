"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { getOrdenesCompra, deleteOrdenCompra, getLaboratorios, getDetallesOrdenCompra } from '@/services/api';

const columns = [
  { key: "NroOrdenC", label: "N° Orden" },
  { key: "fechaEmision", label: "Fecha Emisión" },
  { key: "Total", label: "Total" },
  { key: "CodLab", label: "Laboratorio" },
  { key: "NrofacturaProv", label: "N° Factura Proveedor" },
];

export default function OrdenesCompraPage() {
  const router = useRouter();
  const [ordenes, setOrdenes] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    fetchOrdenes();
    fetchLaboratoriosList();
    fetchDetalles();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'ordenCompraMensaje' && e.newValue) {
        fetchOrdenes();
        fetchDetalles();
      }
      if (e.key === 'detalleOrdenCompraMensaje' && e.newValue) {
        fetchOrdenes();
        fetchDetalles();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (selected && !showDeleteModal) setSelected(null);
        if (showDeleteModal) setShowDeleteModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selected, showDeleteModal]);

  const fetchOrdenes = async () => {
    setLoading(true);
    try {
      const data = await getOrdenesCompra();
      setOrdenes(data);
    } catch {
      setMensajeGlobal("Error al cargar las órdenes de compra");
    }
    setLoading(false);
  };

  const fetchLaboratoriosList = async () => {
    try {
      const data = await getLaboratorios();
      setLaboratorios(data);
    } catch {}
  };

  const fetchDetalles = async () => {
    try {
      const data = await getDetallesOrdenCompra();
      setDetalles(data);
    } catch {}
  };

  const getLabNombre = (id) => laboratorios.find(l => l.CodLab === id)?.razonSocial || "-";

  const ordenesFiltradas = ordenes.filter(oc => {
    const nroOrdenStr = String(oc.NroOrdenC).padStart(3, '0');
    return (
      columns.some(col => (oc[col.key] || "").toString().toLowerCase().includes(filtro.toLowerCase())) ||
      getLabNombre(oc.CodLab).toLowerCase().includes(filtro.toLowerCase()) ||
      nroOrdenStr.includes(filtro)
    );
  });

  // Calcula el total sumando los montouni de los detalles asociados a la orden
  const getTotalOrden = (nroOrdenC) => {
    return detalles
      .filter(d => d.NroOrdenC === nroOrdenC)
      .reduce((sum, d) => sum + Number(d.montouni || 0), 0)
      .toFixed(2);
  };

  // Eliminar
  const handleEliminar = async () => {
    if (!selected) return;
    setEliminando(true);
    try {
      const res = await deleteOrdenCompra(selected.NroOrdenC);
      if (res && res.message) {
        setMensajeGlobal("Orden de compra eliminada exitosamente");
        setShowDeleteModal(false); setSelected(null);
        await fetchOrdenes();
        if (typeof window !== 'undefined') {
          localStorage.setItem('ordenCompraMensaje', 'Orden de compra eliminada');
        }
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setMensajeGlobal("Error al eliminar la orden de compra");
      }
    } catch {
      setMensajeGlobal("Error al eliminar la orden de compra");
    }
    setEliminando(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Órdenes de Compra</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => router.push('/ordenes-compra/nueva')}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Filtrar órdenes de compra..."
        className="mb-6 px-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      {mensajeGlobal && (
        <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left">
          {mensajeGlobal}
        </div>
      )}
      <div className="overflow-x-auto w-full shadow-md rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(col => (
                <th key={col.key} className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ordenesFiltradas.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td></tr>
            ) : (
              ordenesFiltradas.map((oc) => (
                <tr
                  key={oc.NroOrdenC}
                  className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => setSelected(oc)}
                >
                  <td className="p-3 text-sm text-gray-800">{String(oc.NroOrdenC).padStart(3, '0')}</td>
                  <td className="p-3 text-sm text-gray-800">{oc.fechaEmision?.slice(0,10)}</td>
                  <td className="p-3 text-sm text-gray-800">{getTotalOrden(oc.NroOrdenC)}</td>
                  <td className="p-3 text-sm text-gray-800">{getLabNombre(oc.CodLab)}</td>
                  <td className="p-3 text-sm text-gray-800">{oc.NrofacturaProv}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal de detalle */}
      {selected && !showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Detalle de Orden de Compra</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">N° Orden</div>
                  <div className="text-gray-900 font-medium text-sm">{String(selected.NroOrdenC).padStart(3, '0')}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Fecha Emisión</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.fechaEmision?.slice(0,10)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Total</div>
                  <div className="text-gray-900 font-medium text-sm">{getTotalOrden(selected.NroOrdenC)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Laboratorio</div>
                  <div className="text-gray-900 font-medium text-sm">{getLabNombre(selected.CodLab)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">N° Factura Proveedor</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.NrofacturaProv}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Situación</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.Situacion}</div>
                </div>
              </div>
            </div>
            {/* Botones de acciones */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => router.push(`/ordenes-compra/editar/${selected.NroOrdenC}`)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                Editar
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                setShowDeleteModal(false);
                setSelected(null);
              }}
            >
              ×
            </button>
            <div className="pr-8">
              <h2 className="text-base font-semibold mb-2 text-gray-800 mb-8">Confirmar Eliminación</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  ¿Estás seguro de que quieres eliminar la orden de compra N° "{String(selected.NroOrdenC).padStart(3, '0')}"?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelected(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminar}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={eliminando}
                >
                  {eliminando ? (
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
      )}
    </div>
  );
} 