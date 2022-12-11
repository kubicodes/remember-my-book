import Ajv, { Schema, ValidateFunction } from "ajv";

export interface SchemaValidationService {
    getValidationFunction(schema: Schema): ValidateFunction;
}

export class AjvSchemaValidationService<T> implements SchemaValidationService {
    private ajvSingleton: Ajv;

    public getValidationFunction(schema: Schema): ValidateFunction {
        if (!this.ajvSingleton) {
            this.ajvSingleton = new Ajv();
        }

        return this.ajvSingleton.compile<T>(schema);
    }
}
