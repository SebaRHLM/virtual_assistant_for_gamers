-- ================================
-- TABLA 1: Usuario
-- ================================
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    rut VARCHAR(15) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    comuna VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rol VARCHAR(20) DEFAULT 'usuario'
);
-- ================================
-- TABLA 2 : Asistente
-- ================================
CREATE TABLE asistente (
    id_asistente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    modelo VARCHAR(100),
    version VARCHAR(50),
    descripcion TEXT
);

-- ===============================================
-- TABLA 3 : Mensaje (1:N con Usuario y Asistente)
-- ===============================================
CREATE TABLE mensaje (
    id_mensaje SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_asistente INT REFERENCES asistente(id_asistente) ON DELETE SET NULL,
    contenido TEXT NOT NULL,
    tipo_consulta VARCHAR(50) CHECK (tipo_consulta IN ('compatibilidad', 'comparacion', 'general')),
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    es_de_usuario BOOLEAN DEFAULT TRUE
);

-- ===============================================
-- TABLA 4 : Componente (padre de todas las demás)
-- ===============================================
CREATE TABLE componente (
    id_componente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100),
    tipo VARCHAR(50) CHECK (tipo IN ('CPU','GPU','Motherboard','RAM','PSU','Storage','Case')),
    descripcion TEXT,
    precio NUMERIC(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- TABLAS 5 - Tipos componente (1:1 con Componente)
-- ===============================================

-- ===================
-- 	TABLA 5.1 - CPU
-- ===================
CREATE TABLE cpu (
    id_cpu INT PRIMARY KEY REFERENCES componente(id_componente) ON DELETE CASCADE,
    socket VARCHAR(50),
    nucleos INT,
    hilos INT,
    frecuencia_ghz NUMERIC(4,2)
);

-- ===================
-- 	TABLA 5.2 - GPU
-- ===================
CREATE TABLE gpu (
    id_gpu INT PRIMARY KEY REFERENCES componente(id_componente) ON DELETE CASCADE,
    chipset VARCHAR(100),
    vram_gb INT,
    longitud_mm INT
);

-- ===================
-- 	TABLA 5.3 - Motherboard
-- ===================
CREATE TABLE motherboard (
    id_motherboard INT PRIMARY KEY REFERENCES componente(id_componente) ON DELETE CASCADE,
    socket VARCHAR(50),
    ram_type VARCHAR(50),
    chipset VARCHAR(100)
);

-- ===================
-- 	TABLA 5.4 - RAM
-- ===================
CREATE TABLE ram (
    id_ram INT PRIMARY KEY REFERENCES componente(id_componente) ON DELETE CASCADE,
    tipo_ram VARCHAR(50),
    capacidad_gb INT,
    velocidad_mhz INT
);

-- ===================
-- 	TABLA 5.5 - PSU
-- ===================
CREATE TABLE psu (
    id_psu INT PRIMARY KEY REFERENCES componente(id_componente) ON DELETE CASCADE,
    potencia_w INT,
    eficiencia VARCHAR(50)
);

-- ===================
-- 	TABLA 5.6 - Storage
-- ===================
CREATE TABLE storage (
    id_storage INT PRIMARY KEY REFERENCES componente(id_componente) ON DELETE CASCADE,
    tipo VARCHAR(50),
    capacidad_gb INT,
    interfaz VARCHAR(50)
);

-- ===================
-- 	TABLA 5.7 - CASE
-- ===================
CREATE TABLE case_tower (
    id_case INT PRIMARY KEY REFERENCES componente(id_componente) ON DELETE CASCADE,
    form_factor VARCHAR(50),
    max_gpu_length INT
);

-- ===============================================================
-- TABLA 6 - INTERMEDIA: mensaje_componente(N:N entre componentes)
-- ===============================================================
CREATE TABLE mensaje_componente (
    id_mensaje INT REFERENCES mensaje(id_mensaje) ON DELETE CASCADE,
    id_componente INT REFERENCES componente(id_componente) ON DELETE CASCADE,
    PRIMARY KEY (id_mensaje, id_componente)
);
