/**
 * api.ts — FastAPI バックエンドのクライアント
 * 仕様書 §3.1 (API 設計方針) / §7.2 (Idempotency-Key) / §7.1 (カーソル型) 準拠
 */

import { getUserId } from '@/lib/session';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ===== 型定義 =====

export interface SearchResultItem {
  id: string;
  content: string;
  score: number;
  source: string;
}

export interface AnalysisRequest {
  market: string;
  asset: string;
  idea_detail: string;
  pdf_blob_url?: string;
  user_id?: number;
}

export interface Stage1Axis {
  score: string; // ◎ ○ △ ×
  reason: string;
  key_points?: string[];
}

export interface Stage1Result {
  external?: Stage1Axis;
  internal?: Stage1Axis;
  org?: Stage1Axis;
}

export interface ProposalNextAction {
  person: string;
  action: string;
}

export interface Proposal {
  title: string;
  summary: string;
  timing_score?: string;
  timing_reason?: string;
  tech_fit_score?: string;
  tech_fit_reason?: string;
  bottleneck?: string;
  bottleneck_solution?: string;
  next_actions?: ProposalNextAction[];
}

export interface Tier2Customer {
  summary?: string;
  key_insights?: string[];
}

export interface Tier2Competitor {
  summary?: string;
  white_space?: string;
  our_advantage?: string;
  key_insights?: string[];
}

export interface Tier2KeyPerson {
  name: string;
  role: string;
}

export interface Tier2Company {
  summary?: string;
  reusable_assets?: string[];
  key_persons?: Tier2KeyPerson[];
  lessons_learned?: string;
}

export interface Tier2 {
  customer?: Tier2Customer;
  competitor?: Tier2Competitor;
  company?: Tier2Company;
}

export interface Stage2Result {
  proposals?: Proposal[];
  approver_summary?: string;
  tier2?: Tier2;
}

export interface Citation {
  id: string;
  name: string;
  /** "internal" | "external" | "persons" */
  source: string;
  /** "一般" | "社外秘" | "機密" */
  classification_level: string;
}

export interface AnalysisResponse {
  analysis_id: number;
  status: string;
  go_no?: string;
  stage1?: Stage1Result;
  stage2?: Stage2Result;
  related_node_ids?: string[];
  citations?: Citation[];
}

export interface AnalysisHistoryItem {
  id: number;
  market: string;
  asset: string;
  idea_detail: string;
  status: string;
  go_no_flag?: string;
  created_at: string;
}

export interface AnalysisHistoryResponse {
  data: AnalysisHistoryItem[];
  next_cursor?: string;
  has_more: boolean;
}

// ===== ユーティリティ =====

async function http<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  // X-User-Id を自動付与 (Phase 1 モック認証)。Phase 2 で JWT/Cookie に置換予定
  const userId = getUserId();
  const authHeader: Record<string, string> = userId !== null ? { 'X-User-Id': String(userId) } : {};
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    const err = new Error(
      `API ${res.status} ${res.statusText}: ${JSON.stringify(body)}`
    );
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return (await res.json()) as T;
}

export interface MeResponse {
  user_id: number;
  name: string;
  email: string;
  department_id: number | null;
  department_name: string | null;
  role_id: number;
  role_name: string;
  max_classification: string;
  allowed_levels: string[];
}

export interface PastProjectCreate {
  project_id: string;
  title: string;
  outcome: 'success' | 'fail' | 'partial';
  conditions_now?: Record<string, unknown>;
  reusable_assets?: string[];
  lessons_learned?: string;
  classification_level: '一般' | '社外秘' | '機密';
  source_doc_id?: string;
  business_unit_id: number;
}

// ===== エンドポイント =====

export async function fetchMe(): Promise<MeResponse> {
  return http('/api/v1/me');
}

export async function createPastProject(
  body: PastProjectCreate
): Promise<{ project_id: string; status: string }> {
  return http('/api/v1/past_projects', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function searchDocs(
  q: string,
  n = 5,
  deptIds?: string,
  classification?: string
): Promise<{ query: string; results: SearchResultItem[]; total_found: number }> {
  const params = new URLSearchParams({ q, n: String(n) });
  if (deptIds) params.set('dept_ids', deptIds);
  if (classification) params.set('classification', classification);
  return http(`/api/v1/search?${params.toString()}`);
}

export async function createAnalysis(
  body: AnalysisRequest,
  idempotencyKey: string
): Promise<AnalysisResponse> {
  return http('/api/v1/analyses', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(body),
  });
}

export async function getAnalysis(id: number): Promise<AnalysisResponse> {
  return http(`/api/v1/analyses/${id}`);
}

export async function listAnalyses(
  limit = 20,
  cursor?: string,
  userIdOverride?: number
): Promise<AnalysisHistoryResponse> {
  // 通常はログインユーザーの履歴を返す (バックエンドが X-User-Id から導出)。
  // admin が他ユーザーの履歴を覗くときだけ userIdOverride を指定。
  const params = new URLSearchParams({
    limit: String(limit),
  });
  if (cursor) params.set('cursor', cursor);
  if (userIdOverride) params.set('user_id', String(userIdOverride));
  return http(`/api/v1/analyses?${params.toString()}`);
}

export async function deleteAnalysis(id: number): Promise<void> {
  await http(`/api/v1/analyses/${id}`, { method: 'DELETE' });
}

export async function postFeedback(
  analysisId: number,
  rating: number,
  comment?: string
): Promise<{ id: number; status: string }> {
  return http('/api/v1/feedback', {
    method: 'POST',
    body: JSON.stringify({ analysis_id: analysisId, rating, comment }),
  });
}

/** PyVis HTML を返すエンドポイント。<iframe srcDoc> に渡す */
export function buildGraphUrl(nodeIds: string[]): string {
  const params = new URLSearchParams();
  if (nodeIds.length > 0) params.set('node_ids', nodeIds.join(','));
  return `${API_BASE}/api/v1/graph?${params.toString()}`;
}

export async function fetchGraphHtml(nodeIds: string[]): Promise<string> {
  // /graph は HTML を返すため http() (JSON 前提) を使わず直 fetch するが、
  // X-User-Id は他エンドポイント同様に手動付与が必要 (Phase 1 モック認証)
  const url = buildGraphUrl(nodeIds);
  const userId = getUserId();
  const headers: Record<string, string> = userId !== null ? { 'X-User-Id': String(userId) } : {};
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Graph fetch failed: ${res.status}`);
  }
  return res.text();
}
