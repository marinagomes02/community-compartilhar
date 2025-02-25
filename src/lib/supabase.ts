export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      application: {
        Row: {
          "community-link": string | null
          id: string
        }
        Insert: {
          "community-link"?: string | null
          id?: string
        }
        Update: {
          "community-link"?: string | null
          id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          date: string
          description: string
          id: number
          image: string
          inserted_at: string
          location: string
          tags: string[]
          title: string
          user_id: string
        }
        Insert: {
          date: string
          description: string
          id?: number
          image: string
          inserted_at?: string
          location: string
          tags: string[]
          title: string
          user_id: string
        }
        Update: {
          date?: string
          description?: string
          id?: number
          image?: string
          inserted_at?: string
          location?: string
          tags?: string[]
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      future_users: {
        Row: {
          created_at: string | null
          email: string
        }
        Insert: {
          created_at?: string | null
          email: string
        }
        Update: {
          created_at?: string | null
          email?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          created_at: string
          id: string
          isComplete: boolean | null
          isCurrentSponsor: boolean | null
          localization: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          isComplete?: boolean | null
          isCurrentSponsor?: boolean | null
          localization?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          isComplete?: boolean | null
          isCurrentSponsor?: boolean | null
          localization?: string | null
          name?: string | null
        }
        Relationships: []
      }
      howtos: {
        Row: {
          description: string
          difficulty: Database["public"]["Enums"]["how_to_difficulty"]
          duration: Database["public"]["Enums"]["how_to_duration"]
          id: number
          image: string
          inserted_at: string
          steps: Json[]
          tags: string[]
          title: string
          user_id: string
        }
        Insert: {
          description: string
          difficulty: Database["public"]["Enums"]["how_to_difficulty"]
          duration: Database["public"]["Enums"]["how_to_duration"]
          id?: number
          image: string
          inserted_at?: string
          steps: Json[]
          tags: string[]
          title: string
          user_id: string
        }
        Update: {
          description?: string
          difficulty?: Database["public"]["Enums"]["how_to_difficulty"]
          duration?: Database["public"]["Enums"]["how_to_duration"]
          id?: number
          image?: string
          inserted_at?: string
          steps?: Json[]
          tags?: string[]
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "howtos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      map_pins: {
        Row: {
          group_id: string | null
          id: string
          inserted_at: string
          lat: number
          lng: number
          owner_type: Database["public"]["Enums"]["pin_type"] | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          inserted_at?: string
          lat: number
          lng: number
          owner_type?: Database["public"]["Enums"]["pin_type"] | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          inserted_at?: string
          lat?: number
          lng?: number
          owner_type?: Database["public"]["Enums"]["pin_type"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "map_pins_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: true
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about_me: string
          birth_date: string | null
          completed_course: boolean
          display_name: string
          email: string
          group_id: string | null
          id: string
          image: string | null
          job: string | null
          looking_for_group: boolean | null
          motivation: string
          phone_number: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_roles"]
          show_link: boolean
        }
        Insert: {
          about_me?: string
          birth_date?: string | null
          completed_course?: boolean
          display_name?: string
          email: string
          group_id?: string | null
          id: string
          image?: string | null
          job?: string | null
          looking_for_group?: boolean | null
          motivation?: string
          phone_number?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_roles"]
          show_link?: boolean
        }
        Update: {
          about_me?: string
          birth_date?: string | null
          completed_course?: boolean
          display_name?: string
          email?: string
          group_id?: string | null
          id?: string
          image?: string | null
          job?: string | null
          looking_for_group?: boolean | null
          motivation?: string
          phone_number?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_roles"]
          show_link?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
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
      how_to_difficulty: "easy" | "medium" | "hard"
      how_to_duration: "short" | "medium" | "long"
      pin_type: "user" | "group" | "another"
      user_roles: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never