import { model, models, Schema } from 'mongoose';

export interface IAdmin {
    email: string,
    password: string,
    role: string,
}

const AdminSchema = new Schema<IAdmin>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'admin' },
});

const Admin = models.admin || model('admin', AdminSchema);

export default Admin;