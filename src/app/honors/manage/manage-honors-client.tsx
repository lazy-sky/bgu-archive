"use client";

import { MemberAvatar } from "@/components/member-avatar";
import { Select } from "@/components/ui/select";
import { useAuth, useSupabase } from "@/components/auth-provider";
import {
  deleteAchievement,
  deleteAward,
  fetchHallOfFame,
  insertAchievement,
  insertAward,
  nextSortOrder,
  updateAchievement,
} from "@/lib/hall-of-fame-api";
import { fetchMembers } from "@/lib/members-api";
import { fetchProfile } from "@/lib/profile-api";
import type { HallOfFameEntry } from "@/types/hall-of-fame";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function AchievementCard({
  entry,
  busy,
  onSave,
  onDelete,
  onRemoveHonoree,
  onAddHonoree,
  memberOptions,
}: {
  entry: HallOfFameEntry;
  busy: boolean;
  onSave: (input: {
    title: string;
    description: string;
    sortOrder: number;
  }) => void;
  onDelete: () => void;
  onRemoveHonoree: (userId: string) => void;
  onAddHonoree: (userId: string) => void;
  memberOptions: { id: string; label: string }[];
}) {
  const [title, setTitle] = useState(entry.title);
  const [description, setDescription] = useState(entry.description);
  const [sortOrder, setSortOrder] = useState(String(entry.sortOrder));
  const [pickUser, setPickUser] = useState("");

  useEffect(() => {
    setTitle(entry.title);
    setDescription(entry.description);
    setSortOrder(String(entry.sortOrder));
  }, [entry.id, entry.title, entry.description, entry.sortOrder]);

  const sortNum = Number.parseInt(sortOrder, 10);

  return (
    <li className="rounded-xl border border-amber-900/10 bg-white/85 p-4 shadow-sm sm:p-5">
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="font-medium text-amber-950">제목</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-amber-950">설명</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2"
          />
        </label>
        <label className="block w-full max-w-[8rem] text-sm">
          <span className="font-medium text-amber-950">정렬 순서</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-1 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={
              busy ||
              !title.trim() ||
              Number.isNaN(sortNum)
            }
            onClick={() =>
              onSave({
                title: title.trim(),
                description: description.trim(),
                sortOrder: sortNum,
              })
            }
            className="rounded-full border border-amber-900/25 bg-amber-950 px-4 py-2 text-sm font-medium text-amber-50 hover:bg-amber-900 disabled:opacity-50"
          >
            저장
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="rounded-full border border-red-800/25 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-50 disabled:opacity-50"
          >
            업적 삭제
          </button>
        </div>
      </div>

      <div className="mt-5 border-t border-amber-900/10 pt-4">
        <h3 className="text-sm font-semibold text-amber-950">달성 회원</h3>
        {entry.honorees.length > 0 ? (
          <ul className="mt-2 space-y-2" role="list">
            {entry.honorees.map((h) => (
              <li
                key={h.userId}
                className="flex items-center justify-between gap-2 rounded-lg border border-amber-900/10 bg-amber-50/50 px-2 py-1.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <MemberAvatar
                    config={h.avatarConfig}
                    size={36}
                    seedFallback={h.userId}
                    className="shrink-0 ring-amber-900/10"
                  />
                  <span className="truncate text-sm font-medium text-amber-950">
                    {h.displayName}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRemoveHonoree(h.userId)}
                  className="shrink-0 text-xs font-medium text-red-800 underline underline-offset-2 hover:text-red-950 disabled:opacity-50"
                >
                  제거
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-amber-800/70">아직 없습니다.</p>
        )}

        <div className="mt-3 flex flex-wrap items-end gap-2">
          <label className="min-w-[12rem] flex-1 text-sm">
            <span className="text-amber-900/75">회원 추가</span>
            <Select
              value={pickUser}
              onChange={(e) => setPickUser(e.target.value)}
              className="mt-1"
            >
              <option value="">선택…</option>
              {memberOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </Select>
          </label>
          <button
            type="button"
            disabled={busy || !pickUser}
            onClick={() => {
              onAddHonoree(pickUser);
              setPickUser("");
            }}
            className="rounded-full border border-amber-900/25 bg-white px-4 py-2 text-sm font-medium text-amber-950 hover:bg-amber-50 disabled:opacity-50"
          >
            추가
          </button>
        </div>
      </div>
    </li>
  );
}

export function ManageHonorsClient() {
  const supabase = useSupabase();
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  function invalidateHallCaches() {
    queryClient.invalidateQueries({ queryKey: ["hall-of-fame"] });
    queryClient.invalidateQueries({ queryKey: ["member-achievement-badges"] });
  }

  const { data: profile, isPending: profilePending } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => {
      if (!supabase || !userId) return null;
      return fetchProfile(supabase, userId);
    },
    enabled: !!supabase && !!userId,
  });

  const { data: entries = [], isPending: hallPending } = useQuery({
    queryKey: ["hall-of-fame"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchHallOfFame(supabase);
    },
    enabled: !!supabase && profile?.is_admin === true,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: () => {
      if (!supabase) throw new Error("데이터를 불러올 수 없습니다.");
      return fetchMembers(supabase);
    },
    enabled: !!supabase && profile?.is_admin === true,
  });

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSort, setNewSort] = useState("");

  const suggestedSort = useMemo(() => nextSortOrder(entries), [entries]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) throw new Error("연결 없음");
      const n = Number.parseInt(newSort, 10);
      if (!newTitle.trim()) throw new Error("제목을 입력해 주세요.");
      if (Number.isNaN(n)) throw new Error("정렬 순서를 확인해 주세요.");
      await insertAchievement(supabase, {
        title: newTitle,
        description: newDescription,
        sortOrder: n,
      });
    },
    onSuccess: () => {
      invalidateHallCaches();
      setNewTitle("");
      setNewDescription("");
      setNewSort("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (vars: {
      id: string;
      title: string;
      description: string;
      sortOrder: number;
    }) => {
      if (!supabase) throw new Error("연결 없음");
      await updateAchievement(supabase, vars.id, {
        title: vars.title,
        description: vars.description,
        sortOrder: vars.sortOrder,
      });
    },
    onSuccess: () => {
      invalidateHallCaches();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("연결 없음");
      await deleteAchievement(supabase, id);
    },
    onSuccess: () => {
      invalidateHallCaches();
    },
  });

  const addAwardMutation = useMutation({
    mutationFn: async (vars: { achievementId: string; userId: string }) => {
      if (!supabase) throw new Error("연결 없음");
      await insertAward(supabase, vars.achievementId, vars.userId);
    },
    onSuccess: () => {
      invalidateHallCaches();
    },
  });

  const removeAwardMutation = useMutation({
    mutationFn: async (vars: { achievementId: string; userId: string }) => {
      if (!supabase) throw new Error("연결 없음");
      await deleteAward(supabase, vars.achievementId, vars.userId);
    },
    onSuccess: () => {
      invalidateHallCaches();
    },
  });

  useEffect(() => {
    if (newSort === "") setNewSort(String(suggestedSort));
  }, [suggestedSort, newSort]);

  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    addAwardMutation.isPending ||
    removeAwardMutation.isPending;

  if (!supabase) {
    return (
      <p className="text-sm text-amber-900">
        지금은 불러올 수 없습니다.
      </p>
    );
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-amber-900/15 bg-white/70 p-6 text-amber-900">
        <p>관리자 전용입니다. 로그인해 주세요.</p>
        <Link
          href="/auth/login"
          className="mt-3 inline-block text-sm font-medium text-amber-800 underline"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  if (profilePending) {
    return <p className="text-amber-900/70">불러오는 중…</p>;
  }

  if (!profile?.is_admin) {
    return (
      <div className="rounded-xl border border-amber-900/15 bg-white/70 p-6 text-amber-900">
        <p>관리자만 접근할 수 있습니다.</p>
        <Link
          href="/honors"
          className="mt-3 inline-block text-sm font-medium text-amber-800 underline"
        >
          명예의 전당으로
        </Link>
      </div>
    );
  }

  function memberOptionsFor(entry: HallOfFameEntry) {
    const awarded = new Set(entry.honorees.map((h) => h.userId));
    return members
      .filter((m) => !awarded.has(m.id))
      .map((m) => ({ id: m.id, label: m.displayName }));
  }

  return (
    <div className="space-y-8">
      <section
        className="rounded-xl border border-amber-900/10 bg-white/80 p-4 shadow-sm sm:p-6"
        aria-labelledby="new-achievement-heading"
      >
        <h2
          id="new-achievement-heading"
          className="text-sm font-semibold text-amber-950"
        >
          새 업적
        </h2>
        <div className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="font-medium text-amber-950">제목</span>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-amber-950">설명</span>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2"
            />
          </label>
          <label className="block w-full max-w-[8rem] text-sm">
            <span className="font-medium text-amber-950">정렬 순서</span>
            <input
              type="number"
              value={newSort}
              onChange={(e) => setNewSort(e.target.value)}
              className="mt-1 w-full rounded-lg border border-amber-900/15 bg-white px-3 py-2 text-amber-950 outline-none ring-amber-400/30 focus:ring-2"
            />
          </label>
          <button
            type="button"
            disabled={
              busy ||
              !newTitle.trim() ||
              Number.isNaN(Number.parseInt(newSort, 10))
            }
            onClick={() => createMutation.mutate()}
            className="rounded-full bg-amber-950 px-5 py-2 text-sm font-medium text-amber-50 hover:bg-amber-900 disabled:opacity-50"
          >
            {createMutation.isPending ? "추가 중…" : "업적 추가"}
          </button>
          {createMutation.isError ? (
            <p className="text-sm text-red-700" role="alert">
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : "추가하지 못했습니다."}
            </p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="list-heading">
        <h2 id="list-heading" className="text-sm font-semibold text-amber-950">
          업적 목록
        </h2>
        {hallPending ? (
          <p className="mt-3 text-sm text-amber-900/70">불러오는 중…</p>
        ) : entries.length === 0 ? (
          <p className="mt-3 text-sm text-amber-800/80">
            아직 업적이 없습니다. 위에서 추가해 주세요.
          </p>
        ) : (
          <ul className="mt-4 space-y-6" role="list">
            {entries.map((entry) => (
              <AchievementCard
                key={entry.id}
                entry={entry}
                busy={busy}
                memberOptions={memberOptionsFor(entry)}
                onSave={(input) =>
                  updateMutation.mutate({ id: entry.id, ...input })
                }
                onDelete={() => {
                  if (
                    typeof window !== "undefined" &&
                    !window.confirm("이 업적과 달성 기록을 모두 삭제할까요?")
                  ) {
                    return;
                  }
                  deleteMutation.mutate(entry.id);
                }}
                onRemoveHonoree={(uid) =>
                  removeAwardMutation.mutate({
                    achievementId: entry.id,
                    userId: uid,
                  })
                }
                onAddHonoree={(uid) =>
                  addAwardMutation.mutate({
                    achievementId: entry.id,
                    userId: uid,
                  })
                }
              />
            ))}
          </ul>
        )}
        {(updateMutation.isError ||
          deleteMutation.isError ||
          addAwardMutation.isError ||
          removeAwardMutation.isError) && (
          <p className="mt-4 text-sm text-red-700" role="alert">
            저장에 실패했습니다. 다시 시도해 주세요.
          </p>
        )}
      </section>
    </div>
  );
}
