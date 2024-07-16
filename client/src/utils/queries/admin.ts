import Admin, { IAdmin } from "@/utils/models/Admin";

export async function getAdminByEmail(email: string) {
    console.log('getAdminByEmail called with:', email);
    try {
        const admin = await Admin.findOne({ email }).lean();
        console.log('Admin found:', admin);
        return admin;
    } catch (error) {
        console.error('Error in getAdminByEmail:', error);
        throw error;
    }
}
