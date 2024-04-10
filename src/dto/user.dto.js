export class UserDto {

  constructor({
    first_name,
    last_name,
    email,
    gender,
    password,
    rol = 'user'
  }) {
    this.first_name = first_name
    this.last_name = last_name
    this.email = email
    this.gender = gender
    this.password = password
    this.rol = rol
  }

  // toPOJO() {
  //   return {
  //     first_name: this.first_name,
  //     last_name: this.last_name,
  //     email: this.email,
  //     gender: this.gender,
  //     password: this.password,
  //     rol: this.rol,
  //   }
  // }
}

