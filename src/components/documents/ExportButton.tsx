import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react"; // Removed Download import
import { Document, ContractCertificationData } from "@/types";
import { toast } from "sonner";

interface ExportButtonProps {
  documents: Document[];
  disabled?: boolean;
}

export function ExportButton({ documents, disabled = false }: ExportButtonProps) {
  const exportToExcel = () => {
    try {
      // Filter only contract certifications with extracted data
      const certifications = documents.filter(doc => 
        doc.type === 'contract_certification' && 
        doc.extractedData && 
        doc.status === 'completed'
      );

      if (certifications.length === 0) {
        toast.error('No hay certificaciones de contratos para exportar');
        return;
      }

      // Convert to Excel/CSV format
      const headers = [
        'Cliente',
        'Contratista',
        'Fecha Inicio',
        'Fecha Fin',
        'Objeto',
        'No. Contrato',
        'Valor sin IVA',
        'Valor con IVA',
        'Valor en SMMLV',
        'Valor en SMMLV con IVA',
        'Duración (Meses)',
        'Actividades',
        'Firmante',
        'Cargo Firmante',
        'NIT Contratista'
      ];

      const csvData = certifications.map(doc => {
        const data = doc.extractedData as ContractCertificationData;
        return [
          data.cliente || 'N/A',
          data.contratista || 'N/A',
          data.fechaInicio || 'N/A',
          data.fechaFin || 'N/A',
          data.objeto || 'N/A',
          data.numeroContrato || 'N/A',
          data.valorSinIva?.toLocaleString('es-CO') || '0',
          data.valorConIva?.toLocaleString('es-CO') || '0',
          data.valorSMMLV?.toString() || '0',
          data.valorSMMLVIva?.toString() || '0',
          data.duracionMeses?.toString() || '0',
          data.actividades?.join('; ') || 'N/A',
          data.firmante || 'N/A',
          data.cargoFirmante || 'N/A',
          data.nitContratista || 'N/A'
        ];
      });

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `certificaciones_contratos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exportadas ${certifications.length} certificaciones a Excel`);
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Error al exportar los datos');
    }
  };

  return (
    <Button 
      onClick={exportToExcel} 
      disabled={disabled}
      variant="outline"
      className="gap-2"
    >
      <FileSpreadsheet className="h-4 w-4" />
      Exportar a Excel
    </Button>
  );
}