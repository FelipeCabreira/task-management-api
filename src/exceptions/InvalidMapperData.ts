export class InvalidMapperData extends Error {
  constructor(message: string = 'provided invalid mapper data') {
    super(message);
    this.name = 'Invalid Mapper Data';
  }
}
