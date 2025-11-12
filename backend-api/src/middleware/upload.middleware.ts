import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // Para __dirname en ES Modules

// Configuración para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define la ruta de subida relativa a la raíz del proyecto
const projectRoot = path.resolve(__dirname, '..', '..'); 
const uploadDir = path.join(projectRoot, 'uploads/evidencias');

// Asegúrate de que el directorio exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Directorio de destino
    },
    filename: (req, file, cb) => {
        // Generar un nombre de archivo único
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// Filtro de archivos
const fileFilter = (req: any, file: any, cb: any) => {
    // Aceptar solo ciertos tipos de archivos
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido.'), false);
    }
};

export const uploadEvidencia = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 } // Límite de 10MB
}).single('evidencia'); // 'evidencia' es el nombre del campo en el formulario