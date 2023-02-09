export type JSON =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSON }
  | JSON[]

export interface Database {
  public: {
    Tables: {
      images: {
        Row: {
          id: number
          title: string | null
          url: string
        }
        Insert: {
          id?: number
          title?: string | null
          url: string
        }
        Update: {
          id?: number
          title?: string | null
          url?: string
        }
      }
      memes: {
        Row: {
          id: number
          image_id: number
          tag_id: number
        }
        Insert: {
          id?: number
          image_id: number
          tag_id: number
        }
        Update: {
          id?: number
          image_id?: number
          tag_id?: number
        }
      }
      tags: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      timestamp: {
        Row: {
          id: number
          timestamp: number
        }
        Insert: {
          id?: number
          timestamp: number
        }
        Update: {
          id?: number
          timestamp?: number
        }
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
