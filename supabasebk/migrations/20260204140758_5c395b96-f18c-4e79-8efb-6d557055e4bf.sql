-- Corrigir políticas de segurança temporárias

-- 1. Remover políticas temporárias de units
DROP POLICY IF EXISTS "units_insert_temp" ON public.units;

-- 2. Atualizar política de insert em units para apenas admins
CREATE POLICY "Admins podem criar units"
  ON public.units FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem modificar units"
  ON public.units FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar units"
  ON public.units FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Remover política temporária de user_roles
DROP POLICY IF EXISTS "user_roles_insert_temp" ON public.user_roles;

-- 4. Corrigir política de audit_logs - apenas service role pode inserir
DROP POLICY IF EXISTS "Sistema pode inserir logs" ON public.audit_logs;

CREATE POLICY "Usuários autenticados podem inserir logs de auditoria"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);