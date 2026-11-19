# 操作地图

由正式清单生成，执行前发现当前安装版Schema。

| 动作 | 用途 | 必填参数 | 效果 |
| --- | --- | --- | --- |
| list_projects | 查找专业工程 |  | read |
| get_project | 读取固定专业工程 | object_id | read |
| save_project | 保存完整专业工程 | expected_revision, expected_sha256, operation_key, content | managed_write |
| get_source | 分块读取固定来源 | object_id, source_index | read |
| get_basis | 读取固定专业依据 | object_id, basis_index | read |
| compare_versions | 比较固定专业修订 | object_id, from_revision, to_revision | read |
| export_project | 分块导出完整专业数据 | object_id, format | read |
| build_context | 准备有界创作上下文 | object_id, goal, max_chars | read |
| create_handoff | 准备本工程AI接续 | object_id, goal | read |
| get_operation | 回读原操作 | operation_key | read |
| put_material | 维护原始素材 | object_id, expected_revision, expected_sha256, operation_key, material | managed_write |
| put_bit | 维护段子 | object_id, expected_revision, expected_sha256, operation_key, bit | managed_write |
| remove_bit | 移除段子 | object_id, expected_revision, expected_sha256, operation_key, bit_id | managed_write |
| put_callback | 维护回扣 | object_id, expected_revision, expected_sha256, operation_key, callback | managed_write |
| remove_callback | 移除回扣 | object_id, expected_revision, expected_sha256, operation_key, callback_id | managed_write |
| put_set | 维护节目段单 | object_id, expected_revision, expected_sha256, operation_key, set | managed_write |
| remove_set | 移除节目段单 | object_id, expected_revision, expected_sha256, operation_key, set_id | managed_write |
| put_variant | 维护包袱备选 | object_id, expected_revision, expected_sha256, operation_key, variant | managed_write |
| remove_variant | 移除包袱备选 | object_id, expected_revision, expected_sha256, operation_key, variant_id | managed_write |
| put_rehearsal | 维护固定排演记录 | object_id, expected_revision, expected_sha256, operation_key, rehearsal | managed_write |
| put_note | 维护固定意见 | object_id, expected_revision, expected_sha256, operation_key, note | managed_write |
| remove_note | 移除固定意见 | object_id, expected_revision, expected_sha256, operation_key, note_id | managed_write |
| target_digest | 读取目标固定摘要 | object_id, target_kind, target_id | read |
| check_standup | 检查专业关系与过期依据 | object_id | read |
| callback_basis | 核对回扣依据 | object_id, seed_bit_id, return_bit_id | read |
| set_basis | 核对节目依据 | object_id, items | read |
| set_view | 读取段单与回扣顺序 | object_id, set_id | read |
| compare_sets | 比较节目次序 | object_id, from_id, to_id | read |
| rehearsal_view | 回读固定开放麦手记 | object_id, rehearsal_id | read |
| record_rehearsal | 固定完整排演快照 | object_id, expected_revision, expected_sha256, operation_key, set_id, record_id, title, outcomes, declaration | managed_write |
| apply_variant | 应用固定局部备选 | object_id, expected_revision, expected_sha256, operation_key, variant_id | managed_write |
| export_reading | 导出专业阅读本 | object_id | read |
| export_review | 导出完整审核本 | object_id | read |
