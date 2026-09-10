export type Database = {
  public: {
    Tables: {
      drivers: {
        Row: {
          company: string
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          company: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          company?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          id: string
          invoice_number: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_number: string
          trip_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invoice_number?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          driver_id: string
          id: string
          notes: string | null
          trip_date: string
          trip_number: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          id?: string
          notes?: string | null
          trip_date: string
          trip_number: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          id?: string
          notes?: string | null
          trip_date?: string
          trip_number?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'trips_driver_id_fkey'
            columns: ['driver_id']
            isOneToOne: false
            referencedRelation: 'drivers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'trips_vehicle_id_fkey'
            columns: ['vehicle_id']
            isOneToOne: false
            referencedRelation: 'vehicles'
            referencedColumns: ['id']
          },
        ]
      }
      vehicles: {
        Row: {
          company: string
          created_at: string
          id: string
          is_active: boolean
          make: string
          plate_number: string
        }
        Insert: {
          company: string
          created_at?: string
          id?: string
          is_active?: boolean
          make: string
          plate_number: string
        }
        Update: {
          company?: string
          created_at?: string
          id?: string
          is_active?: boolean
          make?: string
          plate_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_trip: {
        Args: {
          p_driver_id: string
          p_vehicle_id: string
          p_trip_date: string
          p_invoice_numbers: string[]
          p_notes?: string | null
        }
        Returns: string
      }
      invoice_number_exists: {
        Args: {
          p_invoice_number: string
        }
        Returns: boolean
      }
      update_admin_trip: {
        Args: {
          p_trip_id: string
          p_driver_id: string
          p_vehicle_id: string
          p_trip_date: string
          p_notes?: string | null
          p_invoice_numbers: string[]
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
