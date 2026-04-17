-- Crear base de datos
CREATE DATABASE gestion_cursos;
-- Tabla de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    vivienda VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol_id INT REFERENCES roles(id) ON DELETE CASCADE,
    carrera VARCHAR(100) NOT NULL,
    ciclo INT NOT NULL
);

-- Tabla de cursos
CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    profesor_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT true
);

-- Tabla de inscripciones (relación estudiante-curso)
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id INT REFERENCES cursos(id) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice único para asegurar que solo exista un admin
CREATE UNIQUE INDEX unico_admin ON usuarios (rol_id) WHERE rol_id = 1;

-- Insertar roles iniciales
INSERT INTO roles (nombre) VALUES ('admin'), ('profesor'), ('estudiante');

-- Insertar usuario administrador inicial
INSERT INTO usuarios (dni, nombres, apellidos, telefono, vivienda, email, password, rol_id, carrera, ciclo)
VALUES (
    '00000000',
    'Administrador',
    'Principal',
    '900000000',
    'Lima',
    'admin@gestioncursos.com',
    crypt('admin123', gen_salt('bf')),
    (SELECT id FROM roles WHERE nombre = 'admin'),
    'N/A',
    0
);

-- Insertar profesores de prueba (DNIs y teléfonos peruanos)
INSERT INTO usuarios (dni, nombres, apellidos, telefono, vivienda, email, password, rol_id, carrera, ciclo)
VALUES
('87654321', 'Carlos', 'Ramírez', '987654321', 'Lima', 'carlos.ramirez@gestioncursos.com', crypt('123456', gen_salt('bf')), (SELECT id FROM roles WHERE nombre = 'profesor'), 'Ingeniería de Sistemas', 3),
('76543210', 'María', 'Gonzales', '976543210', 'Arequipa', 'maria.gonzales@gestioncursos.com', crypt('123456', gen_salt('bf')), (SELECT id FROM roles WHERE nombre = 'profesor'), 'Administración', 2),
('65432109', 'José', 'Fernández', '965432109', 'Cusco', 'jose.fernandez@gestioncursos.com', crypt('123456', gen_salt('bf')), (SELECT id FROM roles WHERE nombre = 'profesor'), 'Contabilidad', 4);

-- Insertar estudiantes de prueba
INSERT INTO usuarios (dni, nombres, apellidos, telefono, vivienda, email, password, rol_id, carrera, ciclo)
VALUES
('54321098', 'Lucía', 'Torres', '954321098', 'Trujillo', 'lucia.torres@gestioncursos.com', crypt('123456', gen_salt('bf')), (SELECT id FROM roles WHERE nombre = 'estudiante'), 'Derecho', 1),
('43210987', 'Pedro', 'Quispe', '943210987', 'Piura', 'pedro.quispe@gestioncursos.com', crypt('123456', gen_salt('bf')), (SELECT id FROM roles WHERE nombre = 'estudiante'), 'Educación', 5);

-- Insertar cursos de prueba
INSERT INTO cursos (nombre, descripcion, profesor_id, activo)
VALUES
('Programación Web', 'Curso de desarrollo de aplicaciones web con Angular y Node.js', (SELECT id FROM usuarios WHERE email = 'carlos.ramirez@gestioncursos.com'), true),
('Contabilidad Básica', 'Fundamentos de contabilidad para estudiantes de primer ciclo', (SELECT id FROM usuarios WHERE email = 'jose.fernandez@gestioncursos.com'), true),
('Derecho Civil', 'Introducción al derecho civil peruano', (SELECT id FROM usuarios WHERE email = 'maria.gonzales@gestioncursos.com'), true);

-- Inscripciones de prueba
INSERT INTO inscripciones (usuario_id, curso_id)
VALUES
((SELECT id FROM usuarios WHERE email = 'lucia.torres@gestioncursos.com'), (SELECT id FROM cursos WHERE nombre = 'Programación Web')),
((SELECT id FROM usuarios WHERE email = 'pedro.quispe@gestioncursos.com'), (SELECT id FROM cursos WHERE nombre = 'Contabilidad Básica'));

-- Trigger para limitar máximo 5 profesores
CREATE OR REPLACE FUNCTION limitar_profesores()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.rol_id = (SELECT id FROM roles WHERE nombre = 'profesor')) THEN
    IF (SELECT COUNT(*) FROM usuarios WHERE rol_id = (SELECT id FROM roles WHERE nombre = 'profesor')) >= 5 THEN
      RAISE EXCEPTION 'Ya existen 5 profesores registrados';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limitar_profesores
BEFORE INSERT ON usuarios
FOR EACH ROW
EXECUTE FUNCTION limitar_profesores();
