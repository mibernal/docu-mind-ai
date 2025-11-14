// src/services/templateService.ts
import { prisma } from '../lib/db';
import { jsonToString } from '../utils/json';

export class TemplateService {
  private predefinedTemplates = {
    CONTRACT_CERTIFICATION: {
      name: "Certificación Contractual",
      description: "Para documentos de certificación de experiencia contractual",
      fields: [
        {
          name: "cliente",
          type: "text",
          required: true,
          description: "Nombre del cliente o entidad contratante"
        },
        {
          name: "contratista", 
          type: "text",
          required: true,
          description: "Nombre del contratista o proveedor"
        },
        {
          name: "fechaInicio",
          type: "date", 
          required: true,
          description: "Fecha de inicio del contrato"
        },
        {
          name: "fechaFin",
          type: "date",
          required: true,
          description: "Fecha de finalización del contrato"
        },
        {
          name: "objeto",
          type: "text",
          required: true,
          description: "Objeto del contrato"
        },
        {
          name: "valorSinIva",
          type: "currency",
          required: true,
          description: "Valor del contrato sin IVA"
        },
        {
          name: "valorConIva",
          type: "currency",
          required: true,
          description: "Valor del contrato con IVA"
        },
        {
          name: "valorSMMLV",
          type: "number",
          required: false,
          description: "Valor en salarios mínimos legales vigentes"
        },
        {
          name: "valorSMMLVIva",
          type: "number",
          required: false,
          description: "Valor con IVA en salarios mínimos legales vigentes"
        },
        {
          name: "duracionMeses",
          type: "number",
          required: false,
          description: "Duración del contrato en meses"
        },
        {
          name: "actividades",
          type: "array",
          required: false,
          description: "Actividades realizadas en el contrato"
        },
        {
          name: "firmante",
          type: "text",
          required: false,
          description: "Persona que firma el documento"
        },
        {
          name: "cargoFirmante",
          type: "text",
          required: false,
          description: "Cargo del firmante"
        },
        {
          name: "nitContratista",
          type: "text",
          required: false,
          description: "NIT del contratista"
        }
      ]
    },
    INVOICE_PROCESSING: {
      name: "Procesamiento de Facturas",
      description: "Para extracción de datos de facturas",
      fields: [
        {
          name: "numeroFactura",
          type: "text",
          required: true,
          description: "Número de la factura"
        },
        {
          name: "fechaEmision",
          type: "date",
          required: true, 
          description: "Fecha de emisión"
        },
        {
          name: "proveedor",
          type: "text",
          required: true,
          description: "Nombre del proveedor"
        },
        {
          name: "cliente",
          type: "text",
          required: true,
          description: "Nombre del cliente"
        },
        {
          name: "subtotal",
          type: "currency",
          required: true,
          description: "Subtotal de la factura"
        },
        {
          name: "iva",
          type: "currency",
          required: true,
          description: "Valor del IVA"
        },
        {
          name: "total",
          type: "currency",
          required: true,
          description: "Total de la factura"
        },
        {
          name: "moneda",
          type: "text",
          required: false,
          description: "Moneda de la factura"
        }
      ]
    },
    LEGAL_DOCUMENTS: {
      name: "Documentos Legales",
      description: "Para tutelas, demandas y documentos judiciales",
      fields: [
        {
          name: "demandante",
          type: "text",
          required: true,
          description: "Nombre del demandante"
        },
        {
          name: "demandado",
          type: "text",
          required: true,
          description: "Nombre del demandado"
        },
        {
          name: "numeroProceso",
          type: "text",
          required: true,
          description: "Número de proceso"
        },
        {
          name: "juzgado",
          type: "text",
          required: true,
          description: "Juzgado o tribunal"
        },
        {
          name: "fechaPresentacion",
          type: "date",
          required: true,
          description: "Fecha de presentación"
        },
        {
          name: "tipoAccion",
          type: "text",
          required: true,
          description: "Tipo de acción legal"
        },
        {
          name: "hechos",
          type: "text",
          required: false,
          description: "Hechos relevantes"
        },
        {
          name: "pretensiones",
          type: "text",
          required: false,
          description: "Pretensiones de la demanda"
        }
      ]
    }
  };

  getPredefinedTemplate(useCase: string) {
    return this.predefinedTemplates[useCase] || this.predefinedTemplates.CONTRACT_CERTIFICATION;
  }

  async createUserTemplateFromPreferences(userId: string, useCase: string) {
    const templateData = this.getPredefinedTemplate(useCase);
    
    return await prisma.extractionTemplate.create({
      data: {
        ...templateData,
        fields: jsonToString({ fields: templateData.fields }),
        userId: userId,
        isDefault: true,
        category: useCase.toLowerCase()
      }
    });
  }
}

export const templateService = new TemplateService();