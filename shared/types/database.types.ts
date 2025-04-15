export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vaults: {
        Row: {
          id: string
          name: string
          creator_id: string
          theme: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          creator_id: string
          theme?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          creator_id?: string
          theme?: string[]
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          bio: string | null
          profile_image: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          bio?: string | null
          profile_image?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          bio?: string | null
          profile_image?: string | null
        }
      }
      members: {
        Row: {
          id: string
          vault_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
        }
        Insert: {
          id?: string
          vault_id: string
          user_id: string
          role: 'owner' | 'editor' | 'viewer'
        }
        Update: {
          id?: string
          vault_id?: string
          user_id?: string
          role?: 'owner' | 'editor' | 'viewer'
        }
      }
      memories: {
        Row: {
          id: string
          vault_id: string
          title: string
          story: string
          type: 'text' | 'audio' | 'photo'
          created_by: string
          tags: string[]
          unlock_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vault_id: string
          title: string
          story: string
          type: 'text' | 'audio' | 'photo'
          created_by: string
          tags?: string[]
          unlock_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vault_id?: string
          title?: string
          story?: string
          type?: 'text' | 'audio' | 'photo'
          created_by?: string
          tags?: string[]
          unlock_date?: string | null
          created_at?: string
        }
      }
      threads: {
        Row: {
          id: string
          memory_id: string
          contributor_id: string
          voice_note: string | null
          photo: string | null
          text_note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          memory_id: string
          contributor_id: string
          voice_note?: string | null
          photo?: string | null
          text_note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          memory_id?: string
          contributor_id?: string
          voice_note?: string | null
          photo?: string | null
          text_note?: string | null
          created_at?: string
        }
      }
    }
  }
} 