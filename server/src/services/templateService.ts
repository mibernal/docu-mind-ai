// server/src/services/templateService.ts
import { prisma } from '../lib/db';
import { jsonToString } from '../utils/json';

/**
 * Tipos
 */
export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'currency'
  | 'percentage'
  | 'boolean'
  | 'array';

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
export const PREDEFINED_TEMPLATES = {
  CONTRACT_CERTIFICATION: {
    name: 'Certificación Contractual',
    description: 'Para documentos de certificación de experiencia contractual',
    fields: [
      { name: 'cliente', type: 'text', required: true, description: 'Nombre del cliente o entidad contratante' },
      { name: 'contratista', type: 'text', required: true, description: 'Nombre del contratista o proveedor' },
      { name: 'fechaInicio', type: 'date', required: true, description: 'Fecha de inicio del contrato' },
      { name: 'fechaFin', type: 'date', required: true, description: 'Fecha de finalización del contrato' },
      { name: 'objeto', type: 'text', required: true, description: 'Objeto del contrato' },
      { name: 'valorSinIva', type: 'currency', required: true, description: 'Valor del contrato sin IVA' },
      { name: 'valorConIva', type: 'currency', required: true, description: 'Valor del contrato con IVA' },
      { name: 'valorSMMLV', type: 'number', required: false, description: 'Valor en salarios mínimos legales vigentes' },
      { name: 'valorSMMLVIva', type: 'number', required: false, description: 'Valor con IVA en salarios mínimos legales vigentes' },
      { name: 'duracionMeses', type: 'number', required: false, description: 'Duración del contrato en meses' },
      { name: 'actividades', type: 'array', required: false, description: 'Actividades realizadas en el contrato' },
      { name: 'firmante', type: 'text', required: false, description: 'Persona que firma el documento' },
      { name: 'cargoFirmante', type: 'text', required: false, description: 'Cargo del firmante' },
      { name: 'nitContratista', type: 'text', required: false, description: 'NIT del contratista' },
    ],
  },
  INVOICE_PROCESSING: {
    name: 'Procesamiento de Facturas',
    description: 'Para extracción de datos de facturas',
    fields: [
      { name: 'numeroFactura', type: 'text', required: true, description: 'Número de la factura' },
      { name: 'fechaEmision', type: 'date', required: true, description: 'Fecha de emisión' },
      { name: 'proveedor', type: 'text', required: true, description: 'Nombre del proveedor' },
      { name: 'cliente', type: 'text', required: true, description: 'Nombre del cliente' },
      { name: 'subtotal', type: 'currency', required: true, description: 'Subtotal de la factura' },
      { name: 'iva', type: 'currency', required: true, description: 'Valor del IVA' },
      { name: 'total', type: 'currency', required: true, description: 'Total de la factura' },
      { name: 'moneda', type: 'text', required: false, description: 'Moneda de la factura' },
    ],
  },
  LEGAL_DOCUMENTS: {
    name: 'Documentos Legales',
    description: 'Para tutelas, demandas y documentos judiciales',
    fields: [
      { name: 'demandante', type: 'text', required: true, description: 'Nombre del demandante' },
      { name: 'demandado', type: 'text', required: true, description: 'Nombre del demandado' },
      { name: 'numeroProceso', type: 'text', required: true, description: 'Número de proceso' },
      { name: 'juzgado', type: 'text', required: true, description: 'Juzgado o tribunal' },
      { name: 'fechaPresentacion', type: 'date', required: true, description: 'Fecha de presentación' },
      { name: 'tipoAccion', type: 'text', required: true, description: 'Tipo de acción legal' },
      { name: 'hechos', type: 'text', required: false, description: 'Hechos relevantes' },
      { name: 'pretensiones', type: 'text', required: false, description: 'Pretensiones de la demanda' },
    ],
  },
} as const;

/**
 * Tipos derivados
 */
export type PredefinedTemplateKey = keyof typeof PREDEFINED_TEMPLATES;
export type PredefinedTemplateValue = (typeof PREDEFINED_TEMPLATES)[PredefinedTemplateKey];

/** Type guard: valida en runtime que la key existe en PREDEFINED_TEMPLATES */
export const isPredefinedTemplateKey = (k: string): k is PredefinedTemplateKey =>
  Object.prototype.hasOwnProperty.call(PREDEFINED_TEMPLATES, k);

/**
 * Servicio
 */
export class TemplateService {
  private predefinedTemplates = PREDEFINED_TEMPLATES;

  /**
   * Devuelve una plantilla predefinida. Si `useCase` no es válido, devuelve la por defecto.
   */
  getPredefinedTemplate(useCase: string): PredefinedTemplateValue {
    if (isPredefinedTemplateKey(useCase)) {
      // ✅ Aquí TS ya sabe que useCase es PredefinedTemplateKey
      return this.predefinedTemplates[useCase];
    }
    return this.predefinedTemplates.CONTRACT_CERTIFICATION;
  }

  /**
   * Crea una plantilla de usuario en la BD a partir de las preferencias (useCase).
   * Nota: `fields` en tu schema.prisma es String, por eso serializamos con jsonToString.
   */
  async createUserTemplateFromPreferences(userId: string, useCase: string) {
    const templateData = this.getPredefinedTemplate(useCase);

    const serializedFields = jsonToString({ fields: templateData.fields });

    return await prisma.extractionTemplate.create({
      data: {
        name: templateData.name,
        description: templateData.description,
        fields: serializedFields,
        userId,
        organizationId,
        isDefault: true,
        category: (useCase || 'contract_certification').toLowerCase(),
      },
    });
  }
}

/** instancia exportada */
export const templateService = new TemplateService();
export default templateService;
