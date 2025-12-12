/**
 * Tipos
 */
export type FieldType = 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean' | 'array';
export interface TemplateField {
    name: string;
    type: FieldType | string;
    required: boolean;
    description?: string;
}
export interface Template {
    name: string;
    description?: string;
    fields: TemplateField[];
}
/**
 * Plantillas predefinidas (as const para crear tipos literales)
 */
export declare const PREDEFINED_TEMPLATES: {
    readonly CONTRACT_CERTIFICATION: {
        readonly name: "Certificación Contractual";
        readonly description: "Para documentos de certificación de experiencia contractual";
        readonly fields: readonly [{
            readonly name: "cliente";
            readonly type: "text";
            readonly required: true;
            readonly description: "Nombre del cliente o entidad contratante";
        }, {
            readonly name: "contratista";
            readonly type: "text";
            readonly required: true;
            readonly description: "Nombre del contratista o proveedor";
        }, {
            readonly name: "fechaInicio";
            readonly type: "date";
            readonly required: true;
            readonly description: "Fecha de inicio del contrato";
        }, {
            readonly name: "fechaFin";
            readonly type: "date";
            readonly required: true;
            readonly description: "Fecha de finalización del contrato";
        }, {
            readonly name: "objeto";
            readonly type: "text";
            readonly required: true;
            readonly description: "Objeto del contrato";
        }, {
            readonly name: "valorSinIva";
            readonly type: "currency";
            readonly required: true;
            readonly description: "Valor del contrato sin IVA";
        }, {
            readonly name: "valorConIva";
            readonly type: "currency";
            readonly required: true;
            readonly description: "Valor del contrato con IVA";
        }, {
            readonly name: "valorSMMLV";
            readonly type: "number";
            readonly required: false;
            readonly description: "Valor en salarios mínimos legales vigentes";
        }, {
            readonly name: "valorSMMLVIva";
            readonly type: "number";
            readonly required: false;
            readonly description: "Valor con IVA en salarios mínimos legales vigentes";
        }, {
            readonly name: "duracionMeses";
            readonly type: "number";
            readonly required: false;
            readonly description: "Duración del contrato en meses";
        }, {
            readonly name: "actividades";
            readonly type: "array";
            readonly required: false;
            readonly description: "Actividades realizadas en el contrato";
        }, {
            readonly name: "firmante";
            readonly type: "text";
            readonly required: false;
            readonly description: "Persona que firma el documento";
        }, {
            readonly name: "cargoFirmante";
            readonly type: "text";
            readonly required: false;
            readonly description: "Cargo del firmante";
        }, {
            readonly name: "nitContratista";
            readonly type: "text";
            readonly required: false;
            readonly description: "NIT del contratista";
        }];
    };
    readonly INVOICE_PROCESSING: {
        readonly name: "Procesamiento de Facturas";
        readonly description: "Para extracción de datos de facturas";
        readonly fields: readonly [{
            readonly name: "numeroFactura";
            readonly type: "text";
            readonly required: true;
            readonly description: "Número de la factura";
        }, {
            readonly name: "fechaEmision";
            readonly type: "date";
            readonly required: true;
            readonly description: "Fecha de emisión";
        }, {
            readonly name: "proveedor";
            readonly type: "text";
            readonly required: true;
            readonly description: "Nombre del proveedor";
        }, {
            readonly name: "cliente";
            readonly type: "text";
            readonly required: true;
            readonly description: "Nombre del cliente";
        }, {
            readonly name: "subtotal";
            readonly type: "currency";
            readonly required: true;
            readonly description: "Subtotal de la factura";
        }, {
            readonly name: "iva";
            readonly type: "currency";
            readonly required: true;
            readonly description: "Valor del IVA";
        }, {
            readonly name: "total";
            readonly type: "currency";
            readonly required: true;
            readonly description: "Total de la factura";
        }, {
            readonly name: "moneda";
            readonly type: "text";
            readonly required: false;
            readonly description: "Moneda de la factura";
        }];
    };
    readonly LEGAL_DOCUMENTS: {
        readonly name: "Documentos Legales";
        readonly description: "Para tutelas, demandas y documentos judiciales";
        readonly fields: readonly [{
            readonly name: "demandante";
            readonly type: "text";
            readonly required: true;
            readonly description: "Nombre del demandante";
        }, {
            readonly name: "demandado";
            readonly type: "text";
            readonly required: true;
            readonly description: "Nombre del demandado";
        }, {
            readonly name: "numeroProceso";
            readonly type: "text";
            readonly required: true;
            readonly description: "Número de proceso";
        }, {
            readonly name: "juzgado";
            readonly type: "text";
            readonly required: true;
            readonly description: "Juzgado o tribunal";
        }, {
            readonly name: "fechaPresentacion";
            readonly type: "date";
            readonly required: true;
            readonly description: "Fecha de presentación";
        }, {
            readonly name: "tipoAccion";
            readonly type: "text";
            readonly required: true;
            readonly description: "Tipo de acción legal";
        }, {
            readonly name: "hechos";
            readonly type: "text";
            readonly required: false;
            readonly description: "Hechos relevantes";
        }, {
            readonly name: "pretensiones";
            readonly type: "text";
            readonly required: false;
            readonly description: "Pretensiones de la demanda";
        }];
    };
};
/**
 * Tipos derivados
 */
export type PredefinedTemplateKey = keyof typeof PREDEFINED_TEMPLATES;
export type PredefinedTemplateValue = (typeof PREDEFINED_TEMPLATES)[PredefinedTemplateKey];
/** Type guard: valida en runtime que la key existe en PREDEFINED_TEMPLATES */
export declare const isPredefinedTemplateKey: (k: string) => k is PredefinedTemplateKey;
/**
 * Servicio
 */
export declare class TemplateService {
    private predefinedTemplates;
    /**
     * Devuelve una plantilla predefinida. Si `useCase` no es válido, devuelve la por defecto.
     */
    getPredefinedTemplate(useCase: string): PredefinedTemplateValue;
    /**
     * Crea una plantilla de usuario en la BD a partir de las preferencias (useCase).
     * Nota: `fields` en tu schema.prisma es String, por eso serializamos con jsonToString.
     */
    createUserTemplateFromPreferences(userId: string, useCase: string, organizationId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        fields: string;
        sampleData: string | null;
        isDefault: boolean;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        userId: string | null;
    }>;
}
/** instancia exportada */
export declare const templateService: TemplateService;
export default templateService;
