export class User {
  public id: number;
  public collegeID: string;
  public username: string;
  public email: string;
  public password: string;
  public isAdmin: number;


  constructor(id: number, collegeID: string, username: string, password: string, email: string, isAdmin: number) {
    this.id = id;
    this.collegeID = collegeID;
    this.username = username;
    this.password = password;
    this.email = email;
    this.isAdmin = isAdmin;
  }
}


