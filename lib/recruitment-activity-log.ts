import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type RecruitmentActivityLog = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

type ActivityActor = {
  id?: string | null;
  email?: string | null;
} | null;

export async function logRecruitmentActivity({
  actor,
  action,
  entityType,
  entityId,
  entityLabel,
  details = {},
}: {
  actor: ActivityActor;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityLabel?: string | null;
  details?: Record<string, unknown>;
}) {
  try {
    const { error } = await getSupabaseAdmin()
      .from("recruitment_activity_logs")
      .insert({
        actor_id: actor?.id ?? null,
        actor_email: actor?.email ?? null,
        action,
        entity_type: entityType,
        entity_id: entityId ?? null,
        entity_label: entityLabel ?? null,
        details,
      });

    if (error) {
      console.warn("[RecruitmentActivityLog] insert failed:", error.message);
    }
  } catch (error) {
    console.warn(
      "[RecruitmentActivityLog] insert failed:",
      error instanceof Error ? error.message : error,
    );
  }
}
