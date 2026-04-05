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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      accidents: {
        Row: {
          created_at: string | null
          display_id: string
          fault_ratio: string | null
          id: string
          location_address: string | null
          occurrence_datetime: string
          occurrence_situation: string | null
          police_station: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          display_id: string
          fault_ratio?: string | null
          id?: string
          location_address?: string | null
          occurrence_datetime: string
          occurrence_situation?: string | null
          police_station?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          display_id?: string
          fault_ratio?: string | null
          id?: string
          location_address?: string | null
          occurrence_datetime?: string
          occurrence_situation?: string | null
          police_station?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      correspondence_logs: {
        Row: {
          contact_date: string | null
          content: string
          created_at: string | null
          id: string
          occurrence_date: string
          record_id: string | null
          staff_id: string | null
          updated_at: string
        }
        Insert: {
          contact_date?: string | null
          content: string
          created_at?: string | null
          id?: string
          occurrence_date?: string
          record_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Update: {
          contact_date?: string | null
          content?: string
          created_at?: string | null
          id?: string
          occurrence_date?: string
          record_id?: string | null
          staff_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "correspondence_logs_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "treatment_records"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address_1: string | null
          address_2: string | null
          birth_date: string | null
          created_at: string
          display_id: string | null
          email: string | null
          first_name: string
          first_name_kana: string
          gender_type: Database["public"]["Enums"]["gender_type"]
          id: string
          last_name: string
          last_name_kana: string
          occupation: string | null
          phone_number: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          birth_date?: string | null
          created_at?: string
          display_id?: string | null
          email?: string | null
          first_name: string
          first_name_kana: string
          gender_type?: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name: string
          last_name_kana: string
          occupation?: string | null
          phone_number?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          birth_date?: string | null
          created_at?: string
          display_id?: string | null
          email?: string | null
          first_name?: string
          first_name_kana?: string
          gender_type?: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name?: string
          last_name_kana?: string
          occupation?: string | null
          phone_number?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      treatment_records: {
        Row: {
          accident_cert_applicant: string | null
          accident_cert_received_date: string | null
          accident_id: string | null
          billing_set_applicant: string | null
          billing_set_received_date: string | null
          billing_type: string
          consent_form_received_date: string | null
          created_at: string | null
          display_id: string | null
          expected_end_date: string | null
          has_injury_insurance: boolean | null
          has_lump_sum_payment: boolean | null
          id: string
          injured_parts: string[] | null
          insurance_company_contact_date: string | null
          latest_hospital_visit_date: string | null
          medical_report_applicant: string | null
          medical_report_received_date: string | null
          patient_id: string | null
          statement_creation_date: string | null
          treatment_start_date: string | null
          updated_at: string
        }
        Insert: {
          accident_cert_applicant?: string | null
          accident_cert_received_date?: string | null
          accident_id?: string | null
          billing_set_applicant?: string | null
          billing_set_received_date?: string | null
          billing_type: string
          consent_form_received_date?: string | null
          created_at?: string | null
          display_id?: string | null
          expected_end_date?: string | null
          has_injury_insurance?: boolean | null
          has_lump_sum_payment?: boolean | null
          id?: string
          injured_parts?: string[] | null
          insurance_company_contact_date?: string | null
          latest_hospital_visit_date?: string | null
          medical_report_applicant?: string | null
          medical_report_received_date?: string | null
          patient_id?: string | null
          statement_creation_date?: string | null
          treatment_start_date?: string | null
          updated_at?: string
        }
        Update: {
          accident_cert_applicant?: string | null
          accident_cert_received_date?: string | null
          accident_id?: string | null
          billing_set_applicant?: string | null
          billing_set_received_date?: string | null
          billing_type?: string
          consent_form_received_date?: string | null
          created_at?: string | null
          display_id?: string | null
          expected_end_date?: string | null
          has_injury_insurance?: boolean | null
          has_lump_sum_payment?: boolean | null
          id?: string
          injured_parts?: string[] | null
          insurance_company_contact_date?: string | null
          latest_hospital_visit_date?: string | null
          medical_report_applicant?: string | null
          medical_report_received_date?: string | null
          patient_id?: string | null
          statement_creation_date?: string | null
          treatment_start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_records_accident_id_fkey"
            columns: ["accident_id"]
            isOneToOne: false
            referencedRelation: "accidents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_type: "male" | "female" | "other" | "unknown"
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
    Enums: {
      gender_type: ["male", "female", "other", "unknown"],
    },
  },
} as const
