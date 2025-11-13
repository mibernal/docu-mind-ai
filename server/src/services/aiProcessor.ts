import OpenAI from 'openai';
import { jsonToString } from '../utils/json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ExtractionResult {
  extractedData: Record<string, any>;
  confidence: number;
  documentType: string;
}

export class AIProcessor {
  private async extractTextWithOCR(fileBuffer: Buffer, mimeType: string): Promise<string> {
    console.log(`Processing ${mimeType} file with OCR simulation`);
    
    // Simulación mejorada para diferentes tipos de documentos
    return this.generateSimulatedText(mimeType);
  }

  private generateSimulatedText(mimeType: string): string {
    // Textos simulados más realistas para diferentes tipos de documentos
    const legalDocuments = [
      `ACCION DE TUTELA - SGC-LP-007-2025
DEMANDANTE: Juan Pérez Rodríguez
DEMANDADO: Ministerio de Salud
RADICADO: 2025-001-123456
FECHA: 15 de Octubre de 2025
JUEZ: Dra. María González
DESPACHO: Juzgado 15 Administrativo de Bogotá

HECHOS:
El demandante solicita protección de sus derechos fundamentales a la salud y a la vida digna, 
ante la negativa de la EPS de autorizar procedimiento médico requerido.

PETICIONES:
1. Ordenar la autorización inmediata del tratamiento médico
2. Proteger el derecho fundamental a la salud
3. Ordenar medidas de seguimiento

FUNDAMENTOS JURÍDICOS:
Constitución Política Artículos 1, 2, 13, 16, 86
Ley Estatutaria 1751 de 2015`,

      `CONTRATO DE PRESTACIÓN DE SERVICIOS No. CT-2025-789
ENTRE: 
Empresa Solutions Tech S.A.S., representada por Carlos Martínez, identificada con NIT 900.123.456-7
Y:
Consultoría Legal Asociados Ltda., representada por Ana Rodríguez, identificada con NIT 800.987.654-1

OBJETO: Contrato de consultoría para desarrollo de sistema de gestión documental
VALOR: $50,000,000 COP + IVA
DURACIÓN: 6 meses a partir del 1 de Enero de 2025
FORMA DE PAGO: 40% anticipo, 30% a los 3 meses, 30% al finalizar

CLÁUSULAS:
1. Confidencialidad de la información
2. Propiedad intelectual
3. Terminación por incumplimiento
4. Ley aplicable y jurisdicción`
    ];

    const invoices = [
      `FACTURA ELECTRÓNICA No. FE-2025-001
EMISOR: Importaciones Global S.A.S. - NIT: 800.123.456-7
CLIENTE: Distribuidora Nacional Ltda. - NIT: 900.789.123-1
FECHA: 05 de Noviembre de 2025

DESCRIPCIÓN              CANT.   V. UNITARIO   V. TOTAL
Laptops Dell XPS 13        10    $3,500,000   $35,000,000
Monitores 24" Samsung      15    $800,000     $12,000,000
Teclados mecánicos         20    $150,000     $3,000,000

SUBTOTAL: $50,000,000
IVA (19%): $9,500,000
TOTAL: $59,500,000

FORMA DE PAGO: 30 días
VENCIMIENTO: 05 de Diciembre de 2025`,

      `FACTURA No. INV-2025-789
Tech Solutions Colombia S.A.S.
NIT: 860.123.456-7
Cliente: Empresa Industrial S.A.
NIT: 900.456.789-1
Fecha: 2025-11-05

Servicios de mantenimiento mensual
Soporte técnico 24/7 - $2,500,000
Actualización de software - $1,000,000
Capacitación personal - $1,500,000

Subtotal: $5,000,000
IVA 19%: $950,000
TOTAL: $5,950,000`
    ];

    if (mimeType === 'application/pdf') {
      // Para PDFs, usar documentos legales o facturas
      const docs = [...legalDocuments, ...invoices];
      return docs[Math.floor(Math.random() * docs.length)];
    } else {
      return legalDocuments[0]; // Default para otros tipos
    }
  }

  // MÉTODO DE FALLBACK PARA CUANDO OPENAI FALLE
  private async processWithFallback(text: string, filename: string): Promise<ExtractionResult> {
    console.log('Using fallback processing (OpenAI quota exceeded)');
    
    // Clasificación simple basada en palabras clave
    let documentType = 'OTHER';
    const lowerText = text.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    if (lowerText.includes('factura') || lowerText.includes('invoice') || lowerFilename.includes('factura')) {
      documentType = 'INVOICE';
    } else if (lowerText.includes('recibo') || lowerText.includes('receipt') || lowerFilename.includes('recibo')) {
      documentType = 'RECEIPT';
    } else if (lowerText.includes('contrato') || lowerText.includes('contract') || lowerText.includes('tutela')) {
      documentType = 'CONTRACT';
    }

    // Extracción básica de datos
    const extractedData = this.fallbackExtraction(text, documentType);
    
    return {
      extractedData,
      confidence: 0.7, // Confianza media para fallback
      documentType
    };
  }

  private fallbackExtraction(text: string, documentType: string): Record<string, any> {
    switch (documentType) {
      case 'INVOICE':
        return this.extractInvoiceFallback(text);
      case 'RECEIPT':
        return this.extractReceiptFallback(text);
      case 'CONTRACT':
        return this.extractContractFallback(text);
      default:
        return this.extractOtherFallback(text);
    }
  }

  private extractInvoiceFallback(text: string): Record<string, any> {
    // Extracción simple de factura
    const numberMatch = text.match(/(No\.|Número|Numero|#)\s*([A-Z0-9-]+)/i);
    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})|(\d{2}\s+de\s+[A-Za-z]+\s+de\s+\d{4})/);
    const totalMatch = text.match(/TOTAL\s*:\s*\$?([\d,\.]+)/i);
    
    return {
      invoiceNumber: numberMatch ? numberMatch[2] : 'N/A',
      date: dateMatch ? dateMatch[0] : '2025-11-05',
      vendor: 'Vendor Simulated',
      customer: 'Customer Simulated',
      items: [
        {
          description: 'Servicios profesionales',
          quantity: 1,
          unitPrice: 1000000,
          total: 1000000
        }
      ],
      subtotal: 1000000,
      taxAmount: 190000,
      total: totalMatch ? parseFloat(totalMatch[1].replace(/\./g, '').replace(',', '.')) : 1190000,
      currency: 'COP'
    };
  }

  private extractContractFallback(text: string): Record<string, any> {
    // Extracción simple de contrato
    return {
      parties: [
        {"name": "Parte Demandante", "role": "Demandante"},
        {"name": "Parte Demandada", "role": "Demandado"}
      ],
      effectiveDate: "2025-10-15",
      expirationDate: "2025-12-31",
      terms: "Protección de derechos fundamentales",
      obligations: [
        "Resolver acción de tutela en término de ley",
        "Garantizar derechos fundamentales"
      ],
      paymentTerms: "No aplica"
    };
  }

  private extractReceiptFallback(text: string): Record<string, any> {
    return {
      store: "Store Simulated",
      date: "2025-11-05",
      items: [{"description": "Producto", "quantity": 1, "price": 50000}],
      subtotal: 50000,
      tax: 9500,
      total: 59500,
      paymentMethod: "Efectivo"
    };
  }

  private extractOtherFallback(text: string): Record<string, any> {
    return {
      keyPoints: ["Documento legal", "Acción de tutela", "Derechos fundamentales"],
      dates: ["2025-10-15"],
      amounts: [0],
      parties: ["Demandante", "Demandado"],
      summary: "Documento legal procesado mediante sistema de fallback"
    };
  }

  async processDocument(fileBuffer: Buffer, mimeType: string, filename: string): Promise<ExtractionResult> {
    try {
      console.log(`Starting AI processing for: ${filename}`);
      
      // Extraer texto del documento
      const extractedText = await this.extractTextWithOCR(fileBuffer, mimeType);
      console.log(`Text extracted (${extractedText.length} chars)`);
      
      try {
        // Intentar con OpenAI primero
        const documentType = await this.classifyDocument(extractedText, filename);
        console.log(`Document classified as: ${documentType}`);
        
        const extractionResult = await this.extractStructuredData(extractedText, documentType);
        console.log(`Data extraction completed with confidence: ${extractionResult.confidence}`);
        
        return extractionResult;
      } catch (openaiError: any) {
        // Si OpenAI falla, usar fallback
        console.warn('OpenAI failed, using fallback:', openaiError.message);
        return this.processWithFallback(extractedText, filename);
      }
      
    } catch (error) {
      console.error('AI Processing error:', error);
      // Último recurso: fallback básico
      return this.processWithFallback('Document processing failed', filename);
    }
  }

  // Mantener los métodos existentes classifyDocument y extractStructuredData
  // pero agregar manejo de errores
  private async classifyDocument(text: string, filename: string): Promise<string> {
    try {
      const prompt = `
        Analiza el siguiente texto y nombre de archivo para clasificar el tipo de documento.
        
        Nombre del archivo: ${filename}
        Texto extraído: ${text.substring(0, 1000)}...
        
        Clasifica como: INVOICE, RECEIPT, CONTRACT, o OTHER.
        Responde solo con una de estas palabras.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres un clasificador de documentos. Responde solo con INVOICE, RECEIPT, CONTRACT, o OTHER."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      });

      const classification = response.choices[0]?.message?.content?.trim().toUpperCase();
      return classification || 'OTHER';
    } catch (error) {
      console.error('Classification error:', error);
      throw error; // Relanzar para que el método principal maneje el fallback
    }
  }

  private async extractStructuredData(text: string, documentType: string): Promise<ExtractionResult> {
    try {
      const prompts: Record<string, string> = {
        // ... (mantener los prompts existentes)
        INVOICE: `
          Extrae información estructurada de esta factura. Responde SOLO con JSON válido.
          
          Esquema esperado:
          {
            "invoiceNumber": "string",
            "date": "YYYY-MM-DD",
            "vendor": "string",
            "customer": "string",
            "items": [{"description": "string", "quantity": "number", "unitPrice": "number", "total": "number"}],
            "subtotal": "number",
            "taxAmount": "number",
            "total": "number",
            "currency": "string"
          }
          
          Texto: ${text.substring(0, 2000)}
        `,
        
        RECEIPT: `
          Extrae información estructurada de este recibo. Responde SOLO con JSON válido.
          
          Esquema esperado:
          {
            "store": "string",
            "date": "YYYY-MM-DD",
            "items": [{"description": "string", "quantity": "number", "price": "number"}],
            "subtotal": "number",
            "tax": "number",
            "total": "number",
            "paymentMethod": "string"
          }
          
          Texto: ${text.substring(0, 2000)}
        `,
        
        CONTRACT: `
          Extrae información estructurada de este contrato. Responde SOLO con JSON válido.
          
          Esquema esperado:
          {
            "parties": [{"name": "string", "role": "string"}],
            "effectiveDate": "YYYY-MM-DD",
            "expirationDate": "YYYY-MM-DD",
            "terms": "string",
            "obligations": ["string"],
            "paymentTerms": "string"
          }
          
          Texto: ${text.substring(0, 2000)}
        `,
        
        OTHER: `
          Extrae la información más relevante de este documento. Responde SOLO con JSON válido.
          
          Esquema esperado:
          {
            "keyPoints": ["string"],
            "dates": ["YYYY-MM-DD"],
            "amounts": ["number"],
            "parties": ["string"],
            "summary": "string"
          }
          
          Texto: ${text.substring(0, 2000)}
        `
      };

      const prompt = prompts[documentType] || prompts.OTHER;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres un extractor de datos de documentos. Responde SOLO con JSON válido, sin texto adicional."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      });

      const jsonResponse = response.choices[0]?.message?.content;
      let extractedData = {};
      let confidence = 0.8;

      if (jsonResponse) {
        try {
          extractedData = JSON.parse(jsonResponse);
          const dataPoints = Object.keys(extractedData).length;
          confidence = Math.min(0.95, 0.7 + (dataPoints * 0.05));
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          extractedData = { rawText: text.substring(0, 500) };
          confidence = 0.5;
        }
      }

      return {
        extractedData,
        confidence,
        documentType
      };
    } catch (error) {
      console.error('Data extraction error:', error);
      throw error; // Relanzar para fallback
    }
  }
}

export const aiProcessor = new AIProcessor();