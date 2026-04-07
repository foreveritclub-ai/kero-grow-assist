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
      community_answers: {
        Row: {
          body: string
          created_at: string
          id: string
          is_accepted: boolean
          question_id: string
          user_id: string
          votes: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_accepted?: boolean
          question_id: string
          user_id: string
          votes?: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_accepted?: boolean
          question_id?: string
          user_id?: string
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_questions: {
        Row: {
          answers_count: number
          body: string
          created_at: string
          crop_name: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
          votes: number
        }
        Insert: {
          answers_count?: number
          body: string
          created_at?: string
          crop_name?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
          votes?: number
        }
        Update: {
          answers_count?: number
          body?: string
          created_at?: string
          crop_name?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          votes?: number
        }
        Relationships: []
      }
      community_votes: {
        Row: {
          answer_id: string | null
          created_at: string
          id: string
          question_id: string | null
          user_id: string
          vote_type: number
        }
        Insert: {
          answer_id?: string | null
          created_at?: string
          id?: string
          question_id?: string | null
          user_id: string
          vote_type?: number
        }
        Update: {
          answer_id?: string | null
          created_at?: string
          id?: string
          question_id?: string | null
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_votes_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "community_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosis_feedback: {
        Row: {
          created_at: string
          diagnosis_id: string
          helpful: boolean
          id: string
          user_comment: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          diagnosis_id: string
          helpful: boolean
          id?: string
          user_comment?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          diagnosis_id?: string
          helpful?: boolean
          id?: string
          user_comment?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosis_feedback_diagnosis_id_fkey"
            columns: ["diagnosis_id"]
            isOneToOne: false
            referencedRelation: "diagnosis_history"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosis_history: {
        Row: {
          created_at: string
          crop_name: string | null
          diagnosis_en: string | null
          diagnosis_ki: string | null
          disease_or_issue_en: string | null
          disease_or_issue_ki: string | null
          emergency_solution_en: string | null
          emergency_solution_ki: string | null
          id: string
          image_url: string | null
          mode: string
          prevention_en: Json | null
          prevention_ki: Json | null
          proper_solution_en: string | null
          proper_solution_ki: string | null
          severity: string | null
          solutions_en: Json | null
          solutions_ki: Json | null
          symptoms: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_name?: string | null
          diagnosis_en?: string | null
          diagnosis_ki?: string | null
          disease_or_issue_en?: string | null
          disease_or_issue_ki?: string | null
          emergency_solution_en?: string | null
          emergency_solution_ki?: string | null
          id?: string
          image_url?: string | null
          mode?: string
          prevention_en?: Json | null
          prevention_ki?: Json | null
          proper_solution_en?: string | null
          proper_solution_ki?: string | null
          severity?: string | null
          solutions_en?: Json | null
          solutions_ki?: Json | null
          symptoms?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          crop_name?: string | null
          diagnosis_en?: string | null
          diagnosis_ki?: string | null
          disease_or_issue_en?: string | null
          disease_or_issue_ki?: string | null
          emergency_solution_en?: string | null
          emergency_solution_ki?: string | null
          id?: string
          image_url?: string | null
          mode?: string
          prevention_en?: Json | null
          prevention_ki?: Json | null
          proper_solution_en?: string | null
          proper_solution_ki?: string | null
          severity?: string | null
          solutions_en?: Json | null
          solutions_ki?: Json | null
          symptoms?: string | null
          user_id?: string
        }
        Relationships: []
      }
      farm_crops: {
        Row: {
          created_at: string
          crop_name: string
          diagnosis_id: string | null
          farm_id: string
          growth_stage: string | null
          id: string
          notes: string | null
          planting_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_name: string
          diagnosis_id?: string | null
          farm_id: string
          growth_stage?: string | null
          id?: string
          notes?: string | null
          planting_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop_name?: string
          diagnosis_id?: string | null
          farm_id?: string
          growth_stage?: string | null
          id?: string
          notes?: string | null
          planting_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_crops_diagnosis_id_fkey"
            columns: ["diagnosis_id"]
            isOneToOne: false
            referencedRelation: "diagnosis_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_crops_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          size_hectares: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          size_hectares?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          size_hectares?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          fertilization_enabled: boolean
          id: string
          language: string
          notify_time: string
          pest_alerts_enabled: boolean
          updated_at: string
          user_id: string
          watering_enabled: boolean
        }
        Insert: {
          created_at?: string
          fertilization_enabled?: boolean
          id?: string
          language?: string
          notify_time?: string
          pest_alerts_enabled?: boolean
          updated_at?: string
          user_id: string
          watering_enabled?: boolean
        }
        Update: {
          created_at?: string
          fertilization_enabled?: boolean
          id?: string
          language?: string
          notify_time?: string
          pest_alerts_enabled?: boolean
          updated_at?: string
          user_id?: string
          watering_enabled?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
