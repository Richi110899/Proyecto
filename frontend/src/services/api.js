export async function getMedicamentos() {
    const res = await fetch('http://localhost:3001/api/medicamentos', { cache: 'no-store' });
    return res.json();
  }
  
  export async function getLaboratorios() {
    const res = await fetch('http://localhost:3001/api/laboratorios', { cache: 'no-store' });
    return res.json();
  }
  
  export async function addMedicamento(medicamento) {
    const res = await fetch('http://localhost:3001/api/medicamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicamento)
    });
    return res.json();
  }

  export async function addLaboratorio(laboratorio) {
    const res = await fetch('http://localhost:3001/api/laboratorios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laboratorio)
    });
    return res.json();
  }

  export async function updateLaboratorio(id, laboratorio) {
    const res = await fetch(`http://localhost:3001/api/laboratorios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laboratorio)
    });
    return res.json();
  }

  export async function getOrdenesCompra() {
    const res = await fetch('http://localhost:3001/api/ordenes-compra', { cache: 'no-store' });
    return res.json();
  }

  export async function addOrdenCompra(orden) {
    const res = await fetch('http://localhost:3001/api/ordenes-compra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orden)
    });
    return res.json();
  }

  export async function updateOrdenCompra(id, orden) {
    const res = await fetch(`http://localhost:3001/api/ordenes-compra/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orden)
    });
    return res.json();
  }

  export async function deleteOrdenCompra(id) {
    const res = await fetch(`http://localhost:3001/api/ordenes-compra/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  export async function getDetallesOrdenCompra() {
    const res = await fetch('http://localhost:3001/api/detalles-compra', { cache: 'no-store' });
    return res.json();
  }

  export async function addDetalleOrdenCompra(detalle) {
    const res = await fetch('http://localhost:3001/api/detalles-compra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    return res.json();
  }

  export async function updateDetalleOrdenCompra(id, detalle) {
    const res = await fetch(`http://localhost:3001/api/detalles-compra/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    return res.json();
  }

  export async function deleteDetalleOrdenCompra(id) {
    const res = await fetch(`http://localhost:3001/api/detalles-compra/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }

  export async function getDetallesOrdenVenta() {
    const res = await fetch('http://localhost:3001/api/detalles-venta', { cache: 'no-store' });
    return res.json();
  }

  export async function addDetalleOrdenVenta(detalle) {
    const res = await fetch('http://localhost:3001/api/detalles-venta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    return res.json();
  }

  export async function updateDetalleOrdenVenta(id, detalle) {
    const res = await fetch(`http://localhost:3001/api/detalles-venta/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    return res.json();
  }

  export async function deleteDetalleOrdenVenta(id) {
    const res = await fetch(`http://localhost:3001/api/detalles-venta/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }