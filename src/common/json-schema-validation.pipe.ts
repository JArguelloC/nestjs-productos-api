import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import _Ajv2020 from 'ajv/dist/2020.js';
import _addFormats from 'ajv-formats';

const Ajv2020 = _Ajv2020.default;
const addFormats = _addFormats.default;

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

@Injectable()
export class JsonSchemaValidationPipe implements PipeTransform {
  constructor(private schema: object) {}

  transform(value: any) {
    const validate = ajv.compile(this.schema);
    const valido = validate(value);
    if (!valido) {
      throw new BadRequestException({
        mensaje: 'El cuerpo de la peticion no cumple el contrato JSON Schema',
        errores: validate.errors,
      });
    }
    return value;
  }
}
