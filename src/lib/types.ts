export type MemberRole = "owner" | "member";

export type Profile = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
};

export type Partner = {
  id: string;
  name: string;
};

export type Workspace = {
  id: string;
  name: string;
  inviteCode: string;
  role: MemberRole;
  partner: Partner | null;
  memberCount: number;
};

export type Bootstrap = {
  me: Profile;
  workspace: Workspace | null;
};

export type ChatMessage = {
  id: number;
  userId: string;
  body: string;
  kind: "text" | "file" | "report" | "system";
  refId: string | null;
  createdAt: string;
  authorName: string;
};

export type Folder = {
  id: number;
  name: string;
  createdBy: string;
  createdAt: string;
  docCount: number;
};

export type DocKind = "note" | "web" | "image" | "file" | "board";

export type DocumentItem = {
  id: number;
  folderId: number | null;
  title: string;
  kind: DocKind;
  content: string;
  mime: string | null;
  createdBy: string;
  authorName: string;
  updatedAt: string;
  createdAt: string;
};

export type ReportItem = {
  task: string;
  status: "done" | "doing" | "blocked" | "wait";
  note: string;
};

export type Report = {
  id: number;
  title: string;
  workDate: string;
  summary: string;
  nextPlan: string;
  hours: string | null;
  items: ReportItem[];
  createdBy: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type Stroke = {
  id: string;
  userId: string;
  tool: "pen" | "highlighter" | "eraser";
  color: string;
  width: number;
  points: { x: number; y: number }[];
  t: number;
};

export type StickyNote = {
  id: string;
  userId: string;
  x: number;
  y: number;
  text: string;
  color: string;
  t: number;
};

export type BoardState = {
  strokes: Stroke[];
  notes: StickyNote[];
  updatedAt: string;
  updatedBy: string | null;
};

export type Activity = {
  id: number;
  userId: string;
  authorName: string;
  action: string;
  detail: string;
  createdAt: string;
};

export type Dashboard = {
  files: number;
  messages: number;
  reports: number;
  boardUpdates: number;
  doneThisWeek: number;
  doingThisWeek: number;
  recent: Activity[];
  reportTrend: { date: string; count: number }[];
  fileKinds: { kind: string; count: number }[];
};
