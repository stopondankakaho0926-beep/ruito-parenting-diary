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
      articles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          published: boolean
          is_paid: boolean
          price: number | null
          paywall_position: number | null
          author_id: string
          view_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          published?: boolean
          is_paid?: boolean
          price?: number | null
          paywall_position?: number | null
          author_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          published?: boolean
          is_paid?: boolean
          price?: number | null
          paywall_position?: number | null
          author_id?: string
        }
      }
      purchases: {
        Row: {
          id: string
          created_at: string
          article_id: string
          user_email: string
          stripe_payment_id: string
          status: string
          purchased_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          article_id: string
          user_email: string
          stripe_payment_id: string
          status?: string
          purchased_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          article_id?: string
          user_email?: string
          stripe_payment_id?: string
          status?: string
          purchased_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          created_at: string
          article_id: string
          commenter_name: string
          comment_text: string
          approved: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          article_id: string
          commenter_name: string
          comment_text: string
          approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          article_id?: string
          commenter_name?: string
          comment_text?: string
          approved?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          created_at: string
          user_email: string
          stripe_subscription_id: string
          status: string
          current_period_start: string
          current_period_end: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_email: string
          stripe_subscription_id: string
          status: string
          current_period_start: string
          current_period_end: string
        }
        Update: {
          id?: string
          created_at?: string
          user_email?: string
          stripe_subscription_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
        }
      }
    }
  }
}
