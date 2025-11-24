import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Patient
export const registerPatient = (data) => api.post("/patients/register", data);
export const loginPatient = (data) => api.post("/patients/login", data);
export const getPatientProfile = () => api.get("/patients/profile");
export const updatePatientProfile = (data) => api.put("/patients/profile", data);
export const updatePatientPassword = (data) => api.put("/patients/password", data);
export const updatePatientPhoto = (formData) => api.put("/patients/profile/photo", formData);
export const deletePatientProfile = (data) => api.delete("/patients/profile", { data });
export const getDoctorsByDepartment = (department) => api.get(`/doctors?department=${department}`);

// Doctor
export const loginDoctor = (data) => api.post("/doctors/login", data);
export const getAllDoctors = () => api.get("/doctors");
export const getDoctorAvailability = (id, date) => api.get(`/doctors/${id}/availability?date=${date}`);
export const getDoctorAppointments = (id) => api.get(`/doctors/${id}/appointments`);

// Appointment
export const bookAppointment = (data) => api.post("/appointments", data);
export const createAppointment = (data) => api.post("/appointments", data); // Alias for bookAppointment
export const getMyAppointments = () => api.get("/appointments/my");
export const getAppointments = () => api.get("/appointments");
export const updateAppointmentStatus = (id, data) => api.put(`/appointments/${id}/status`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
export const cancelMyAppointment = (id) => api.put(`/appointments/${id}/cancel`);

// Admin
export const getAllAppointments = () => api.get("/appointments/all");
export const loginAdmin = (data) => api.post("/admins/login", data);
export const adminLogout = () => api.post("/admins/logout");

// Contact
export const createContact = (data) => api.post("/contacts", data);

// --- ADMIN CRUD APIs ---

// User (Patient) Management
export const getUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Doctor Management

export const createDoctor = (doctorData) => api.post('/doctors', doctorData);
export const updateDoctor = (id, doctorData) => api.put(`/doctors/${id}`, doctorData);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);

// Department Management
export const getDepartments = () => api.get('/departments');
export const createDepartment = (departmentData) => api.post('/departments', departmentData);
export const updateDepartment = (id, departmentData) => api.put(`/departments/${id}`, departmentData);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

// System Settings
export const getSystemSettings = () => api.get('/settings');
export const updateSystemSettings = (data) => api.put('/settings', data);