export interface Memo {
  id: number;
  content: string;
  createdTs: number;
  tags?: string[];
  pinned?: boolean;
}

export interface MemosResponse {
  data: Memo[];
}

/**
 * 从 Memos API 获取短动态列表
 * 默认读取前 50 条公开动态
 */
export async function fetchMemos(
  host: string,
  limit = 50
): Promise<Memo[]> {
  const apiUrl = `${host.replace(/\/$/, "")}/api/v1/memos`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Memos API 返回状态 ${response.status}，使用模拟数据`);
      return getMockMemos();
    }

    const data: MemosResponse = await response.json();
    return (data.data || []).slice(0, limit);
  } catch (error) {
    console.warn("无法连接 Memos 服务，使用模拟数据:", error);
    return getMockMemos();
  }
}

/**
 * 使用 Memos 的公开 API 路径
 * 对于不同版本的 Memos，API 路径可能不同
 */
export async function fetchMemosV1(
  host: string,
  limit = 50
): Promise<Memo[]> {
  const baseUrl = host.replace(/\/$/, "");

  // Memos v0.22+ API
  const apiUrl = `${baseUrl}/api/v1/memos?limit=${limit}&status=PUBLISHED`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return getMockMemos();
    }

    const data = await response.json();
    // 不同版本的 Memos 返回格式不同，需要适配
    const memos = Array.isArray(data) ? data : data.memos || data.data || [];
    return memos.slice(0, limit).map((m: any) => ({
      id: m.id || m.uid,
      content: m.content || "",
      createdTs: m.createdTs || m.createTime || m.createdAt || Math.floor(Date.now() / 1000),
      tags: m.tags || [],
      pinned: m.pinned || false,
    }));
  } catch (error) {
    console.warn("Memos API 连接失败，使用模拟数据:", error);
    return getMockMemos();
  }
}

/**
 * 当 Memos 服务不可用时，返回模拟数据以确保构建通过
 */
function getMockMemos(): Memo[] {
  return [
    {
      id: 1,
      content: "🌱 None",
      createdTs: Math.floor(Date.now() / 1000) - 86400,
      tags: ["#碎碎念"],
    },
    {
      id: 2,
      content: "📝 technical knowledge",
      createdTs: Math.floor(Date.now() / 1000) - 172800,
      tags: ["#技术"],
    },
    {
      id: 3,
      content:
        "Thinking",
      createdTs: Math.floor(Date.now() / 1000) - 259200,
      tags: ["#思考"],
    },
  ];
}
