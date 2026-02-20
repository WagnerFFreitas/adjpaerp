import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

interface AuditLogParams {
  action: string;
  entity: string;
  entityId?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
}

export function useAuditLog() {
  const { user, profile, currentUnit } = useAuth();

  const log = useCallback(async ({
    action,
    entity,
    entityId,
    oldData,
    newData,
  }: AuditLogParams) => {
    if (!user) return;

    try {
      await supabase.from('audit_logs').insert({
        unit_id: currentUnit?.id,
        user_id: user.id,
        user_name: profile?.name || user.email || '',
        action,
        entity,
        entity_id: entityId,
        old_data: oldData as Json,
        new_data: newData as Json,
      });
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  }, [user, profile, currentUnit]);

  return { log };
}
