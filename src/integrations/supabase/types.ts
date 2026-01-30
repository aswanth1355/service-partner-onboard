export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      job_updates: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          location_lat: number | null
          location_lng: number | null
          note: string | null
          technician_id: string
          update_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          location_lat?: number | null
          location_lng?: number | null
          note?: string | null
          technician_id: string
          update_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          location_lat?: number | null
          location_lng?: number | null
          note?: string | null
          technician_id?: string
          update_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_updates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_updates_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          accepted_at: string | null
          assigned_technician_id: string | null
          completed_at: string | null
          created_at: string | null
          customer_address: string | null
          customer_id: string
          customer_lat: number
          customer_lng: number
          customer_name: string
          customer_phone: string | null
          estimated_distance: number | null
          estimated_price: number | null
          final_price: number | null
          id: string
          notes: string | null
          service_type: string
          status: string | null
          updated_at: string | null
          vehicle_type: string | null
        }
        Insert: {
          accepted_at?: string | null
          assigned_technician_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_address?: string | null
          customer_id: string
          customer_lat: number
          customer_lng: number
          customer_name: string
          customer_phone?: string | null
          estimated_distance?: number | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          notes?: string | null
          service_type: string
          status?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Update: {
          accepted_at?: string | null
          assigned_technician_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_address?: string | null
          customer_id?: string
          customer_lat?: number
          customer_lng?: number
          customer_name?: string
          customer_phone?: string | null
          estimated_distance?: number | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          notes?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_availability: {
        Row: {
          current_lat: number | null
          current_lng: number | null
          id: string
          is_active: boolean | null
          last_location_update: string | null
          last_status_change: string | null
          technician_id: string
        }
        Insert: {
          current_lat?: number | null
          current_lng?: number | null
          id?: string
          is_active?: boolean | null
          last_location_update?: string | null
          last_status_change?: string | null
          technician_id: string
        }
        Update: {
          current_lat?: number | null
          current_lng?: number | null
          id?: string
          is_active?: boolean | null
          last_location_update?: string | null
          last_status_change?: string | null
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_availability_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: true
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_earnings: {
        Row: {
          amount: number
          description: string | null
          earned_at: string | null
          id: string
          job_id: string | null
          technician_id: string
        }
        Insert: {
          amount: number
          description?: string | null
          earned_at?: string | null
          id?: string
          job_id?: string | null
          technician_id: string
        }
        Update: {
          amount?: number
          description?: string | null
          earned_at?: string | null
          id?: string
          job_id?: string | null
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_earnings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_earnings_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technician_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          gps_lat: number | null
          gps_lng: number | null
          id: string
          phone: string
          service_area: string | null
          service_types: string[] | null
          shop_address: string | null
          shop_name: string | null
          updated_at: string | null
          vehicle_type: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          gps_lat?: number | null
          gps_lng?: number | null
          id: string
          phone: string
          service_area?: string | null
          service_types?: string[] | null
          shop_address?: string | null
          shop_name?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          phone?: string
          service_area?: string | null
          service_types?: string[] | null
          shop_address?: string | null
          shop_name?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_job_pending_or_assigned_to_me: {
        Args: { job_id_param: string }
        Returns: boolean
      }
      is_technician_assigned_to_job: {
        Args: { job_id_param: string }
        Returns: boolean
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
