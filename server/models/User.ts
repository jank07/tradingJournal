export interface User {
    _id?: { $oid: string };
    email: string;
    passwordHash: string;
    createdAt: Date;
}