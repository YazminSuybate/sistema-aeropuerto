import { http, HttpResponse } from 'msw';

export const roles = ["Atención al Pasajero", "Operativo", "Gerencia", "Admin"];

export const areas = [
  "Desarrollo",
  "Gerencia",
  "Atención al Cliente",
  "Seguridad",
  "Mantenimiento",
];

// ------------------------------------

let users = [
  {
    id: 1,
    fullName: "Ana García",
    email: "ana.garcia@empresa.com",
    role: roles[0], 
    area: "",
    status: "activo",
    registrationDate: "2025-01-15",
  },
  {
    id: 2,
    fullName: "Carlos Rodríguez",
    email: "carlos.rodriguez@empresa.com",
    role: roles[1], 
    area: areas[4], 
    status: "activo",
    registrationDate: "2025-02-20",
  },
  {
    id: 3,
    fullName: "María Fernández",
    email: "maria.fernandez@empresa.com",
    role: roles[2], 
    area: "", 
    status: "inactivo",
    registrationDate: "2025-01-10",
  },
  {
    id: 4,
    fullName: "José Martínez",
    email: "jose.martinez@empresa.com",
    role: roles[3], 
    area: "", 
    status: "activo",
    registrationDate: "2025-03-05",
  },
  {
    id: 5,
    fullName: "Laura Sánchez",
    email: "laura.sanchez@empresa.com",
    role: roles[1], 
    area: areas[3], 
    status: "activo",
    registrationDate: "2025-02-28",
  },
];

export const handlers = [
  //Obtiene
  http.get('/api/users', () => {
    return HttpResponse.json(users, { delay: 300 }); 
  }),

  //Crea
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json();
    const id = Math.max(...users.map(u => u.id), 0) + 1;
    const userToCreate = { ...newUser, id };
    users.push(userToCreate);
    return HttpResponse.json(userToCreate, { status: 201 });
  }),

  //Actualiza
  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json();
    const index = users.findIndex(u => u.id === Number(id));

    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    users[index] = { ...users[index], ...updatedData, id: Number(id) };
    return HttpResponse.json(users[index]);
  }),

  //Elimina
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params;
    const initialLength = users.length;
    users = users.filter(u => u.id !== Number(id));

    if (users.length === initialLength) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 200 });
  }),
];