export const paths = {
  features: {
    auth: {
      hooks: {
        useAuth: '/features/auth/hooks/useAuth',
        useOnboarding: '/features/auth/hooks/useOnboarding'
      }
    },
    documents: {
      components: {
        DocumentsTable: '/features/documents/components/DocumentsTable',
        FileUpload: '/features/documents/components/FileUpload',
        AdvancedFilters: '/features/documents/components/AdvancedFilters',
        ExportButton: '/features/documents/components/ExportButton'
      },
      hooks: {
        useDocumentStatus: '/features/documents/hooks/useDocumentStatus'
      }
    },
    dashboard: {
      components: {
        MetricCard: '/features/dashboard/components/MetricCard'
      }
    },
    settings: {
      hooks: {
        usePreferences: '/features/settings/hooks/usePreferences'
      }
    }
  },
  components: {
    layout: {
      AppSidebar: '/components/layout/AppSidebar',
      DashboardLayout: '/components/layout/DashboardLayout'
    },
    ui: {
      // Agregar componentes UI según necesidad
    },
    ErrorBoundary: '/components/ErrorBoundary'
  },
  contexts: {
    AuthContext: '/contexts/AuthContext'
  },
  hooks: {
    useMobile: '/hooks/use-mobile',
    useToast: '/hooks/use-toast'
  }
} as const;
