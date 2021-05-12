export class User {
    role: number;
    id: string;
    userName: string;
    normalizedUserName: string;
    

    constructor(role: number, id: string, userName: string, normalizedUserName: string) {
        this.role = role;
        this.id = id;
        this.userName = userName;
        this.normalizedUserName = normalizedUserName;
    }
}