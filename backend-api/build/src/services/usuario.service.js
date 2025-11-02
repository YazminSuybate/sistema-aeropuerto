import * as bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;
export class UsuarioService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getAllUsuarios() {
        return this.repository.findAll();
    }
    async getUsuarioById(id_usuario) {
        return this.repository.findById(id_usuario);
    }
    async createUsuario(data) {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado.');
        }
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
        const userData = {
            ...data,
            password: hashedPassword
        };
        return this.repository.create(userData);
    }
    async updateUsuario(id_usuario, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        }
        return this.repository.update(id_usuario, data);
    }
    async deleteUsuario(id_usuario) {
        return this.repository.softDelete(id_usuario);
    }
}
//# sourceMappingURL=usuario.service.js.map