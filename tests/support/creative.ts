import assert from 'node:assert/strict';
import { sha } from "./import.ts";
export async function managed(c: any, action: string, input: any, key: string) {
  const p = await c.ok("hetu_prepare_management_operation", {
    management_ref: c.management,
    action: "hetu." + action,
    input,
    summary: "当前用户已要求完整验收，本操作仅限隔离演示作品",
    operation_key: "prepare-" + key,
  });
  await c.ok("hetu_record_management_decision", {
    management_ref: c.management,
    proposal_id: p.proposal_id,
    proposal_sha256: p.proposal_sha256,
    expected_state_revision: p.state_revision,
    decision: "approve",
    authorization_note:
      "用户要求本批完整测试验收，当前为隔离雨港示例的固定操作；不触及真实作品，不外发，不定稿。",
    operation_key: "decide-" + key,
  });
  const result = await c.ok("hetu_execute_management_operation", {
    management_ref: c.management,
    proposal_id: p.proposal_id,
    proposal_sha256: p.proposal_sha256,
    operation_key: "execute-" + key,
  });
  return {
    ...result.result,
    ...(result.task_locator ? { task_locator: result.task_locator } : {}),
  };
}
export async function candidate(c: any, content: string, key: string,taskKind="chapter_draft",kind="text",format="markdown",inputRefs:any[] = []) {
  const preview = await c.ok("hetu_preview_creative_task", {
    management_ref: c.management,
    work_ref: c.work,
    scope_ref: c.management.scope_ref,
    task_kind: taskKind,
    brief: "按固定目标准备隔离候选，不采纳或定稿。",
    input_refs: inputRefs,
    client_adapter: "codex",
    language_tag: "zh-CN",
  });
  const task = await managed(
    c,
    "creative_tasks.prepare",
    { ...preview.prepare_input, operation_key: key + "-task" },
    key + "-task",
  );
  const opened = await c.ok("hetu_open_collaboration_task", {
    task_locator: task.task_locator,
  });
  task.task_ref = opened.task_ref;
  const context = await c.ok("hetu_list_task_context", {task_ref:opened.task_ref,limit:100});
  assert.deepEqual(context.entries.map((entry:any)=>entry.fixed_ref),inputRefs,"下一稿实际任务固定了全部已选来源");
  const contextSnapshots=[];
  for(const entry of context.entries){const read=await c.ok("hetu_read_task_context",{task_ref:opened.task_ref,context_ref:entry.context_ref,max_bytes:65536});assert.equal(read.complete,true,"本轮固定资料完整回读");contextSnapshots.push(read);}
  const result = await c.ok("hetu_submit_creative_result", {
    task_ref: task.task_ref,
    request_sha256: task.request_sha256,
    candidates: [
      {
        kind,
        title: "雨港固定候选",
        source_format: format,
        source_ref_indices: inputRefs.map((_,index)=>index),
        content,
      },
    ],
    complete: true,
    missing_items: [],
    provenance: { client: "codex", skill_version: "0.1.0" },
    operation_key: key + "-submission",
  });
  const saved = result.submission.candidates[0],
    draft = await c.ok("hetu_managed_drafts_get", {
      management_ref: c.management,
      draft_id: saved.draft_ref.draft_id,
    });
  return {
    task,
    result,
    draft,
    context,
    contextSnapshots,
    source_ref: {
      kind: "document",
      work_ref: c.work,
      document_id: draft.draft.evidence_document_id,
      revision_id: draft.draft.evidence_revision_id,
      sha256: sha(content),
    },
  };
}
export async function blueprint(c: any) {
  const bp = await c.ok("hetu_read_blueprint", {
    management_ref: c.management,
    work_ref: c.work,
  });
  const current = await managed(
    c,
    "blueprints.save",
    {
      work_ref: c.work,
      expected: {
        blueprint_id: bp.blueprint.blueprint_id,
        revision: bp.revision,
        sha256: bp.sha256,
      },
      typed_changes: [
        {
          type: "upsert_character",
          entity: {
            character_id: "character_11111111-1111-4111-8111-111111111111",
            name: "林溪",
            aliases: [],
            description: "雨港旧邮局的守信人",
            traits: ["谨慎"],
            facts: [],
            archived: false,
          },
        },
      ],
      operation_key: "blueprint-character",
    },
    "blueprint-character",
  );
  return {
    kind: "blueprint",
    work_ref: c.work,
    blueprint_id: current.blueprint.blueprint_id,
    revision: current.revision,
    sha256: current.sha256,
  };
}
