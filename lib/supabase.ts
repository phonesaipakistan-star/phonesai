import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://xadxdkbdwyulprfukrjb.supabase.co',
  'sb_publishable_xdfjlB6s9sGF3imO0S-l-A_WW1CjdVh',
  {
    global: {
      headers: {
        'X-Client-Info': 'phonesai'
      }
    }
  }
)
