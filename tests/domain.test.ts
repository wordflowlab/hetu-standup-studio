import {test} from 'node:test';import assert from 'node:assert/strict';import {scenario,temporary} from './support/scenario.ts';import {validate} from '../src/domain/model.ts';import {digest} from '../src/domain/shared.ts';import * as E from '../src/domain/engine.ts';

test('完整专业示例和新建固定依据有效',()=>{const p=scenario();validate(p);E.validateTransition(p);});
test('未知字段和重复意见ID拒绝',()=>{const p=scenario();p.extra=true;assert.throws(()=>validate(p));delete p.extra;p.notes.push(p.notes[0]);assert.throws(()=>validate(p));});
test('新意见错误摘要拒绝',()=>{const p=scenario();p.notes[0].target_sha256='0'.repeat(64);assert.throws(()=>E.validateTransition(p));});
test('处理意见必须保留说明',()=>{const p=scenario();p.notes[0].status='resolved';assert.throws(()=>validate(p));p.notes[0].resolution='已对照固定材料处理，待作者阅读。';validate(p);});

test('正序回扣已铺垫，逆序明确警告',()=>{const p=scenario();assert.equal(E.setView(p,'linear').callback_warnings.length,0);assert.equal(E.setView(p,'alternate').callback_warnings.length,1);});
test('未知估时保留，不猜真人表演',()=>{const p=scenario();p.bits[0].estimate_ms=null;assert.equal(E.setView(p,'linear').estimated_ms,null);});
test('重复段子独立出场保留',()=>{const p=scenario();p.sets[0].items.push({...p.sets[0].items[0],id:'again',order:3});validate(p);assert.equal(E.setView(p,'linear').items.length,3);});
test('原始素材不可改写',()=>{const a=scenario(),p=structuredClone(a);p.materials[0].kind='observation';assert.throws(()=>E.validateTransition(p,a));});
test('自回扣及重复关系拒绝',()=>{const p=scenario();p.callbacks[0].return_bit_id='letter';assert.throws(()=>validate(p));const q=scenario();q.callbacks.push({...q.callbacks[0],id:'dup'});assert.throws(()=>validate(q));});
test('新回扣错误摘要拒绝',()=>{const p=scenario();p.callbacks[0].basis_sha256='0'.repeat(64);assert.throws(()=>E.validateTransition(p));});
test('改段子令回扣段单意见和备选全部过期',()=>{const a=scenario(),p=structuredClone(a);p.bits[0].punchline+='新词';E.validateTransition(p,a);const c=E.check(p);assert.equal(c.stale_set_ids.length,2);assert.deepEqual(c.stale_callback_ids,['callback']);assert.deepEqual(c.stale_variant_ids,['variant']);assert.deepEqual(c.stale_note_ids,['note']);});
test('局部备选只改指定字段，其他段子保持',()=>{const p=scenario(),other=structuredClone(p.bits[1]),setup=p.bits[0].setup;E.applyVariant(p,'variant');assert.deepEqual(p.bits[1],other);assert.equal(p.bits[0].setup,setup);assert.equal(p.bits[0].punchline,p.variants[0].replacement);});
test('过期备选拒绝，原段子保持',()=>{const p=scenario();p.bits[0].setup+='改过';const before=structuredClone(p);assert.throws(()=>E.applyVariant(p,'variant'));assert.deepEqual(p,before);});
test('整本保存不能注册基线不符的备选',()=>{const p=scenario();p.variants[0].target_sha256='0'.repeat(64);assert.throws(()=>E.validateTransition(p));});
test('段单出场ID或顺序重复拒绝',()=>{for(const f of ['id','order']){const p=scenario();p.sets[0].items[1][f]=p.sets[0].items[0][f];assert.throws(()=>validate(p));}});
test('新手记必须固定完整当前快照',()=>{const old=scenario(),p=structuredClone(old);p.rehearsals=[temporary(p).rehearsal];E.validateTransition(p,old);p.rehearsals[0].snapshot.bits[0].setup+='偷改';assert.throws(()=>E.validateTransition(p,old));});
test('旧手记只追加并保持旧段子',()=>{const old=scenario();old.rehearsals=[temporary(old).rehearsal];const p=structuredClone(old);p.bits[0].setup+='新词';validate(p);E.validateTransition(p,old);assert.equal(p.rehearsals[0].snapshot.bits[0].setup,old.bits[0].setup);p.rehearsals[0].declaration='覆盖';assert.throws(()=>E.validateTransition(p,old));});
test('手记不能指向快照外出场',()=>{const p=scenario();p.rehearsals=[temporary(p).rehearsal];p.rehearsals[0].outcomes[0].occurrence_id='missing';assert.throws(()=>validate(p));});
test('阅读本保留全部段单与铺垫包袱',()=>{const t=E.reading(scenario());assert.ok(t.includes('先信后票')&&t.includes('先票后信')&&t.includes('铺垫：')&&t.includes('包袱：'));});
