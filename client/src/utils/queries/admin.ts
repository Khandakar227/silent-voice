import Admin from "@/utils/models/Admin";

export async function getAdminByEmail(email: string) {
    try {
        const admin = await Admin.findOne({ email });
        return admin;
    } catch (error) {
        console.error('Error in getAdminByEmail:', error);
        throw error;
    }
}

export async function getAdminById(id: string) {
    try {
        const admin = await Admin.findById(id);
        return admin;
    } catch (error) {
        console.error('Error in getAdminById:', error);
        throw error;
    }
}


