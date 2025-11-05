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
    
    // TODO: Implementar OCR real aquí
    // Para implementación real con Tesseract:
    // if (mimeType === 'application/pdf') {
    //   return this.extractTextFromPDF(fileBuffer);
    // } else if (mimeType.startsWith('image/')) {
    //   return this.extractTextFromImage(fileBuffer);
    // }
    
    // Simulación mejorada basada en el tipo de archivo
    const simulatedText = this.generateSimulatedText(mimeType);
    return simulatedText;
  }

  private generateSimulatedText(mimeType: string): string {
    const invoices = [
      `INVOICE #INV-2023-001
Vendor: Tech Solutions Inc.
Customer: Global Enterprises Ltd.
Date: 2023-11-15
Due Date: 2023-12-15

Items:
- Laptop Computer | Qty: 2 | Price: $1200.00 | Total: $2400.00
- Software License | Qty: 5 | Price: $150.00 | Total: $750.00

Subtotal: $3150.00
Tax (10%): $315.00
Total: $3465.00
Currency: USD`,

      `INVOICE #INV-2023-789
ABC Manufacturing Co.
123 Industrial Way
New York, NY 10001

Bill To:
XYZ Distributors
456 Commerce St
Chicago, IL 60601

Invoice Date: November 20, 2023
Due Date: December 20, 2023

Description           Qty   Unit Price   Amount
Widget A              10    $45.00      $450.00
Gadget B              5     $89.99      $449.95
Service Fee           1     $200.00     $200.00

Subtotal: $1,099.95
Sales Tax (8%): $88.00
Total: $1,187.95
Thank you for your business!`
    ];

    const receipts = [
      `STORE RECEIPT
Store: SuperMart #284
Date: 2023-11-18 14:30:15
Cashier: Maria G.

Milk 2L          2 x $3.49    $6.98
Bread Whole      1 x $2.99    $2.99
Apples Red       1.5 x $4.99  $7.49
Chicken Breast   2 x $8.99    $17.98

Subtotal: $35.44
Tax: $2.84
Total: $38.28
Payment: Credit Card
Thank you!`,

      `COFFEE SHOP RECEIPT
The Daily Grind
123 Main Street

Date: 11/18/2023 08:15 AM
Order: #2847

Latte Grande      2 x $4.50   $9.00
Croissant         1 x $3.25   $3.25
Bottle Water      1 x $2.00   $2.00

Subtotal: $14.25
Tax: $1.14
Total: $15.39
Payment: Cash
Change: $4.61`
    ];

    const contracts = [
      `SERVICE AGREEMENT
Parties:
- Provider: WebTech Solutions Inc.
- Client: Smith Enterprises

Effective Date: 2023-12-01
Term: 12 months

Scope of Services:
1. Website maintenance and hosting
2. Monthly performance reports
3. 24/7 technical support

Payment Terms:
Monthly fee of $500 due on the 1st of each month.
Late payment fee: 5% after 15 days.

Termination: 30 days written notice required.`
    ];

    if (mimeType === 'application/pdf') {
      // Simular factura PDF
      return invoices[Math.floor(Math.random() * invoices.length)];
    } else if (mimeType.startsWith('image/')) {
      // Simular recibo de imagen
      return receipts[Math.floor(Math.random() * receipts.length)];
    } else {
      // Texto genérico
      return `Document text extracted from ${mimeType} file. This is simulated content that would be processed by AI for data extraction.`;
    }
  }

  async processDocument(fileBuffer: Buffer, mimeType: string, filename: string): Promise<ExtractionResult> {
    try {
      console.log(`Starting AI processing for: ${filename}`);
      
      // Extraer texto del documento
      const extractedText = await this.extractTextWithOCR(fileBuffer, mimeType);
      console.log(`Text extracted (${extractedText.length} chars)`);
      
      // Determinar el tipo de documento
      const documentType = await this.classifyDocument(extractedText, filename);
      console.log(`Document classified as: ${documentType}`);
      
      // Extraer datos estructurados
      const extractionResult = await this.extractStructuredData(extractedText, documentType);
      console.log(`Data extraction completed with confidence: ${extractionResult.confidence}`);
      
      return extractionResult;
    } catch (error) {
      console.error('AI Processing error:', error);
      throw new Error('Failed to process document with AI');
    }
  }

  private async classifyDocument(text: string, filename: string): Promise<string> {
    const prompt = `
      Analiza el siguiente texto y nombre de archivo para clasificar el tipo de documento.
      
      Nombre del archivo: ${filename}
      Texto extraído: ${text.substring(0, 1000)}...
      
      Clasifica como: INVOICE, RECEIPT, CONTRACT, o OTHER.
      Responde solo con una de estas palabras.
    `;

    try {
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
      return 'OTHER';
    }
  }

  private async extractStructuredData(text: string, documentType: string): Promise<ExtractionResult> {
    const prompts: Record<string, string> = {
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

    try {
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
      let confidence = 0.8; // Confianza base

      if (jsonResponse) {
        try {
          extractedData = JSON.parse(jsonResponse);
          
          // Calcular confianza basada en la completitud de los datos
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
      return {
        extractedData: { error: "Failed to extract data", rawText: text.substring(0, 500) },
        confidence: 0.1,
        documentType
      };
    }
  }
}

export const aiProcessor = new AIProcessor();