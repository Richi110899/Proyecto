CREATE DATABASE IF NOT EXISTS bd_Farmacia;
USE bd_Farmacia;

CREATE TABLE Especialidad (
  CodEspec INT AUTO_INCREMENT PRIMARY KEY,
  descripcionEsp VARCHAR(100)
);

CREATE TABLE TipoMedic (
  CodTipoMed INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(100)
);

CREATE TABLE Laboratorio (
  CodLab INT AUTO_INCREMENT PRIMARY KEY,
  razonSocial VARCHAR(100),
  direccion VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  contacto VARCHAR(100)
);

CREATE TABLE Medicamento (
  CodMedicamento INT AUTO_INCREMENT PRIMARY KEY,
  descripcionMed VARCHAR(100),
  fechaFabricacion DATE,
  fechaVencimiento DATE,
  Presentacion VARCHAR(100),
  stock INT,
  precioVentaUni DECIMAL(10,2),
  precioVentaPres DECIMAL(10,2),
  CodTipoMed INT,
  Marca VARCHAR(100),
  CodEspec INT,
  FOREIGN KEY (CodTipoMed) REFERENCES TipoMedic(CodTipoMed),
  FOREIGN KEY (CodEspec) REFERENCES Especialidad(CodEspec)
);

CREATE TABLE OrdenVenta (
  NroOrdenVta INT AUTO_INCREMENT PRIMARY KEY,
  fechaEmision DATE,
  Motivo VARCHAR(100),
  Situacion VARCHAR(50)
);

CREATE TABLE DetalleOrdenVta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  NroOrdenVta INT,
  CodMedicamento INT,
  descripcionMed VARCHAR(100),
  cantidadRequerida INT,
  FOREIGN KEY (NroOrdenVta) REFERENCES OrdenVenta(NroOrdenVta),
  FOREIGN KEY (CodMedicamento) REFERENCES Medicamento(CodMedicamento)
);

CREATE TABLE OrdenCompra (
  NroOrdenC INT AUTO_INCREMENT PRIMARY KEY,
  fechaEmision DATE,
  Situacion VARCHAR(50),
  Total DECIMAL(10,2),
  CodLab INT,
  NrofacturaProv VARCHAR(100),
  FOREIGN KEY (CodLab) REFERENCES Laboratorio(CodLab)
);

CREATE TABLE DetalleOrdenCompra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  NroOrdenC INT,
  CodMedicamento INT,
  descripcion VARCHAR(100),
  cantidad INT,
  precio DECIMAL(10,2),
  montouni DECIMAL(10,2),
  FOREIGN KEY (NroOrdenC) REFERENCES OrdenCompra(NroOrdenC),
  FOREIGN KEY (CodMedicamento) REFERENCES Medicamento(CodMedicamento)
);