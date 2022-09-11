export class User {
  collegeID: string;
  username: string;
  email: string;
  password: string;
  isAdmin: number;


  constructor(collegeID: string, username: string, password: string, email: string, isAdmin: number) {
    this.collegeID = collegeID;
    this.username = username;
    this.password = password;
    this.email = email;
    this.isAdmin = isAdmin;
  }
}


