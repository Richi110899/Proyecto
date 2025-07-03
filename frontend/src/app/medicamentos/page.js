"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';

// Endpoints
const API_MED = "http://localhost:3001/api/medicamentos";
const API_ESP = "http://localhost:3001/api/especialidades";
const API_TIPO = "http://localhost:3001/api/tipos";
const API_DETALLES = "http://localhost:3001/api/detalles-venta";

// Floating label input reutilizable
const FloatingInput = ({ label, name, value, onChange, ...props }) => (
  <div className="relative mb-8">
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 bg-transparent"
      placeholder={label}
      autoComplete="off"
      {...props}
    />
    <label
      htmlFor={name}
      className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-800 peer-focus:text-sm"
    >
      {label}
    </label>
  </div>
);

export default function MedicamentosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [medicamentos, setMedicamentos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selected, setSelected] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [modalError, setModalError] = useState("");

  // Cargar catálogos y medicamentos
  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (searchParams.get('edit') === 'success') {
      setMensajeGlobal("Medicamento actualizado exitosamente");
      setTimeout(() => setMensajeGlobal(""), 3000);
      router.replace('/medicamentos');
    }
  }, [searchParams]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'medicamentoMensaje' && e.newValue) {
        fetchAll();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [meds, esp, tipos] = await Promise.all([
        fetch(API_MED).then(r => r.json()),
        fetch(API_ESP).then(r => r.json()),
        fetch(API_TIPO).then(r => r.json()),
      ]);
      setMedicamentos(meds);
      setEspecialidades(esp);
      setTipos(tipos);
    } catch {
      setMensajeGlobal("Error al cargar los datos");
    }
    setLoading(false);
  }

  // Escape para cerrar modales
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (selected && !showDeleteModal) setSelected(null);
        setEditando(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selected]);

  // Helpers para mostrar nombres en vez de IDs
  const getEspecialidad = (id) => especialidades.find(e => e.CodEspec === id)?.descripcionEsp || "-";
  const getTipo = (id) => tipos.find(t => t.CodTipoMed === id)?.descripcion || "-";

  // Filtro
  const medicamentosFiltrados = medicamentos.filter(med =>
    (med.descripcionMed || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (med.CodMedicamento + "").includes(filtro) ||
    getEspecialidad(med.CodEspec).toLowerCase().includes(filtro.toLowerCase()) ||
    getTipo(med.CodTipoMed).toLowerCase().includes(filtro.toLowerCase())
  );

  // Editar
  const handleEditar = async () => {
    if (!editando || !editando.descripcionMed?.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_MED}/${editando.CodMedicamento}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editando),
      });
      if (res.ok) {
        setMensajeGlobal("Medicamento actualizado exitosamente");
        setShowEditModal(false); setEditando(null);
        await fetchAll();
        mutate(API_MED);
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setMensajeGlobal("Error al actualizar el medicamento");
      }
    } catch {
      setMensajeGlobal("Error al actualizar el medicamento");
    }
    setLoading(false);
  };

  // Eliminar
  const handleEliminar = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_MED}/${selected.CodMedicamento}`, { method: "DELETE" });
      if (res.ok) {
        setMensajeGlobal("Medicamento eliminado exitosamente");
        setShowDeleteModal(false); setSelected(null);
        await fetchAll();
        mutate(API_MED);
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setMensajeGlobal("Error al eliminar el medicamento");
      }
    } catch {
      setMensajeGlobal("Error al eliminar el medicamento");
    }
    setLoading(false);
  };

  // Columnas clave para la tabla
  const columns = [
    { key: "CodMedicamento", label: "Código" },
    { key: "descripcionMed", label: "Nombre" },
    { key: "CodEspec", label: "Especialidad" },
    { key: "CodTipoMed", label: "Tipo" },
    { key: "stock", label: "Stock" },
  ];

  // Etiquetas personalizadas para detalles
  const fieldLabels = {
    CodMedicamento: "Código de medicamento",
    descripcionMed: "Nombre",
    fechaFabricacion: "Fecha de fabricación",
    fechaVencimiento: "Fecha de vencimiento",
    Presentacion: "Presentación",
    stock: "Stock",
    precioVentaUni: "Precio unitario",
    precioVentaPres: "Precio presentación",
    CodTipoMed: "Tipo de medicamento",
    Marca: "Marca",
    CodEspec: "Especialidad"
  };

  // Render
  return (
    <div className="w-full max-w-5xl mx-auto ml-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Medicamentos</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => router.push('/medicamentos/nuevo')}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>

      {mensajeGlobal && (
        <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left">
          {mensajeGlobal}
        </div>
      )}

      <input
        type="text"
        placeholder="Filtrar medicamentos..."
        className="mb-6 px-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />

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
            {medicamentosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td>
              </tr>
            ) : (
              medicamentosFiltrados.map((medicamento, index) => (
                <tr
                  key={medicamento.CodMedicamento || index}
                  className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => setSelected(medicamento)}
                >
                  <td className="p-3 text-sm text-gray-800">
                    {(medicamento.CodMedicamento || 0).toString().padStart(3, '0')}
                  </td>
                  <td className="p-3 text-sm text-gray-800">{medicamento.descripcionMed}</td>
                  <td className="p-3 text-sm text-gray-800">{getEspecialidad(medicamento.CodEspec)}</td>
                  <td className="p-3 text-sm text-gray-800">{getTipo(medicamento.CodTipoMed)}</td>
                  <td className="p-3 text-sm text-gray-800">{medicamento.stock}</td>
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
            <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Detalle de Medicamento</h2>
            <div className="space-y-8">
              {/* Fila 1: Código, Nombre, Presentación */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Código</div>
                  <div className="text-gray-900 font-medium text-sm">{String(selected.CodMedicamento).padStart(3, '0')}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Nombre</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.descripcionMed}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Presentación</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.Presentacion}</div>
                </div>
              </div>
              {/* Fila 2: Marca, Especialidad, Tipo de medicamento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Marca</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.Marca}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Especialidad</div>
                  <div className="text-gray-900 font-medium text-sm">{getEspecialidad(selected.CodEspec)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Tipo de medicamento</div>
                  <div className="text-gray-900 font-medium text-sm">{getTipo(selected.CodTipoMed)}</div>
                </div>
              </div>
              {/* Fila 3: Stock, Precio Venta Unidad, Precio Venta Presentación */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Stock</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.stock}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Precio Venta Unidad</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.precioVentaUni}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Precio Venta Presentación</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.precioVentaPres}</div>
                </div>
              </div>
              {/* Fila 4: Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Fecha de fabricación</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.fechaFabricacion?.slice(0,10)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Fecha de vencimiento</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.fechaVencimiento?.slice(0,10)}</div>
                </div>
              </div>
            </div>
            {/* Botones de acciones */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => router.push(`/medicamentos/editar/${selected.CodMedicamento}`)}
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

      {/* Modal para editar */}
      {showEditModal && editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                setShowEditModal(false);
                setEditando(null);
              }}
            >
              ×
            </button>
            <div className="pr-8">
              <h2 className="text-base font-semibold mb-2 text-gray-800 mb-8">Editar Medicamento</h2>
            </div>
            <div className="space-y-6">
              <FloatingInput
                label="Nombre"
                name="descripcionMed"
                value={editando.descripcionMed || ""}
                onChange={e => setEditando({ ...editando, descripcionMed: e.target.value })}
                required
              />
              <FloatingInput
                label="Presentación"
                name="Presentacion"
                value={editando.Presentacion || ""}
                onChange={e => setEditando({ ...editando, Presentacion: e.target.value })}
              />
              <FloatingInput
                label="Marca"
                name="Marca"
                value={editando.Marca || ""}
                onChange={e => setEditando({ ...editando, Marca: e.target.value })}
              />
              <FloatingInput
                label="Stock"
                name="stock"
                type="number"
                value={editando.stock || ""}
                onChange={e => setEditando({ ...editando, stock: e.target.value })}
              />
              <FloatingInput
                label="Precio unitario"
                name="precioVentaUni"
                type="number"
                value={editando.precioVentaUni || ""}
                onChange={e => setEditando({ ...editando, precioVentaUni: e.target.value })}
              />
              <FloatingInput
                label="Precio presentación"
                name="precioVentaPres"
                type="number"
                value={editando.precioVentaPres || ""}
                onChange={e => setEditando({ ...editando, precioVentaPres: e.target.value })}
              />
              <FloatingInput
                label="Fecha de fabricación"
                name="fechaFabricacion"
                type="date"
                value={editando.fechaFabricacion ? editando.fechaFabricacion.slice(0,10) : ""}
                onChange={e => setEditando({ ...editando, fechaFabricacion: e.target.value })}
              />
              <FloatingInput
                label="Fecha de vencimiento"
                name="fechaVencimiento"
                type="date"
                value={editando.fechaVencimiento ? editando.fechaVencimiento.slice(0,10) : ""}
                onChange={e => setEditando({ ...editando, fechaVencimiento: e.target.value })}
              />
              <div className="mb-8">
                <label className="block text-sm text-gray-600 mb-1">Especialidad</label>
                <select
                  className="w-full border-b-2 border-gray-300 h-12 bg-transparent focus:outline-none focus:border-blue-600 text-gray-900"
                  value={editando.CodEspec || ""}
                  onChange={e => setEditando({ ...editando, CodEspec: Number(e.target.value) })}
                >
                  <option value="">Seleccione...</option>
                  {especialidades.map(e => (
                    <option key={e.CodEspec} value={e.CodEspec}>{e.descripcionEsp}</option>
                  ))}
                </select>
              </div>
              <div className="mb-8">
                <label className="block text-sm text-gray-600 mb-1">Tipo de medicamento</label>
                <select
                  className="w-full border-b-2 border-gray-300 h-12 bg-transparent focus:outline-none focus:border-blue-600 text-gray-900"
                  value={editando.CodTipoMed || ""}
                  onChange={e => setEditando({ ...editando, CodTipoMed: Number(e.target.value) })}
                >
                  <option value="">Seleccione...</option>
                  {tipos.map(t => (
                    <option key={t.CodTipoMed} value={t.CodTipoMed}>{t.descripcion}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditando(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditar}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !editando.descripcionMed?.trim()}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
              </div>
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
                  ¿Estás seguro de que quieres eliminar el medicamento "{selected.descripcionMed}"?
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
      )}
    </div>
  );
}