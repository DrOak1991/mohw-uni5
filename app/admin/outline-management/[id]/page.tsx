"use client"

import { useState, use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Check,
  X,
  History,
  Download,
  Library,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  OutlineItem,
  outlineMeta,
  getInitialOutline,
  mockTemplates,
  mockVersions,
} from "@/lib/mock/review-outline"

// --------------- helpers ---------------

let _counter = 100

function nextId() {
  return String(++_counter)
}

function renumber(items: OutlineItem[], prefix = ""): OutlineItem[] {
  return items.map((item, i) => {
    const num = prefix ? `${prefix}.${i + 1}` : `${i + 1}`
    return {
      ...item,
      number: num,
      children: item.children ? renumber(item.children, num) : undefined,
    }
  })
}

// --------------- page component ---------------

export default function OutlineEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const meta = outlineMeta[id] || { name: id }

  const [outline, setOutline] = useState<OutlineItem[]>(() => renumber(getInitialOutline()))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [showVersions, setShowVersions] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  // ---- edit ----
  function startEdit(item: OutlineItem) {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditDescription(item.description)
  }

  function confirmEdit() {
    if (!editingId) return
    setOutline((prev) =>
      renumber(
        applyDeep(prev, editingId, (it) => ({
          ...it,
          title: editTitle,
          description: editDescription,
        })),
      ),
    )
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  // ---- move ----
  function moveUp(parentItems: OutlineItem[] | null, itemId: string) {
    setOutline((prev) => renumber(moveItem(prev, itemId, -1)))
  }

  function moveDown(parentItems: OutlineItem[] | null, itemId: string) {
    setOutline((prev) => renumber(moveItem(prev, itemId, 1)))
  }

  // ---- add child ----
  function addChild(parentId: string) {
    setOutline((prev) =>
      renumber(
        applyDeep(prev, parentId, (it) => ({
          ...it,
          children: [
            ...(it.children || []),
            {
              id: nextId(),
              number: "",
              title: "\u65B0\u9805\u76EE",
              description: "\u8ACB\u8F38\u5165\u8AAA\u660E",
            },
          ],
        })),
      ),
    )
  }

  // ---- delete ----
  function deleteItem(itemId: string) {
    setOutline((prev) => renumber(removeDeep(prev, itemId)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* breadcrumb */}
        <Link
          href="/admin/outline-management"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回大綱規範管理
        </Link>

        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {meta.name}大綱規範
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowVersions(true)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              <History className="w-4 h-4" />
              版本/紀錄
            </button>
            <Button size="sm" onClick={() => setShowTemplates(true)}>
              <Library className="w-4 h-4 mr-1.5" />
              範本庫
            </Button>
          </div>
        </div>

        {/* outline tree */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">大綱結構</h2>

          <div className="space-y-4">
            {outline.map((section, sIdx) => (
              <SectionBlock
                key={section.id}
                item={section}
                isFirst={sIdx === 0}
                isLast={sIdx === outline.length - 1}
                editingId={editingId}
                editTitle={editTitle}
                editDescription={editDescription}
                onEditTitleChange={setEditTitle}
                onEditDescriptionChange={setEditDescription}
                onStartEdit={startEdit}
                onConfirmEdit={confirmEdit}
                onCancelEdit={cancelEdit}
                onMoveUp={() => moveUp(null, section.id)}
                onMoveDown={() => moveDown(null, section.id)}
                onAddChild={() => addChild(section.id)}
                onDelete={() => deleteItem(section.id)}
                onChildMoveUp={(childId) => moveUp(null, childId)}
                onChildMoveDown={(childId) => moveDown(null, childId)}
                onChildDelete={(childId) => deleteItem(childId)}
                onChildStartEdit={(child) => startEdit(child)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---- Version History Modal ---- */}
      <Dialog open={showVersions} onOpenChange={setShowVersions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>版本紀錄</DialogTitle>
            <DialogDescription>查看歷史版本的大綱結構</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto py-2">
            {mockVersions.map((v) => (
              <div
                key={v.version}
                className={`border rounded-lg p-4 ${v.isCurrent ? "border-amber-300 bg-amber-50" : "border-gray-200"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{v.version}</span>
                      {v.isCurrent && (
                        <Badge className="bg-amber-500 text-white border-0 text-xs">
                          編輯中
                        </Badge>
                      )}
                    </div>
                    {v.date && <p className="text-sm text-gray-500 mt-0.5">{v.date}</p>}
                    <p className="text-sm text-gray-500">操作者：{v.operator}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button className="w-full" onClick={() => setShowVersions(false)}>
              關閉
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Template Library Modal ---- */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>範本庫</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto py-2">
            {mockTemplates.map((t) => (
              <div key={t.year} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{t.year}年度</p>
                    <p className="text-sm text-gray-500">{t.label}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1.5" />
                    下載
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button className="w-full" onClick={() => setShowTemplates(false)}>
              關閉
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// --------------- Section Block ---------------

function SectionBlock({
  item,
  isFirst,
  isLast,
  editingId,
  editTitle,
  editDescription,
  onEditTitleChange,
  onEditDescriptionChange,
  onStartEdit,
  onConfirmEdit,
  onCancelEdit,
  onMoveUp,
  onMoveDown,
  onAddChild,
  onDelete,
  onChildMoveUp,
  onChildMoveDown,
  onChildDelete,
  onChildStartEdit,
}: {
  item: OutlineItem
  isFirst: boolean
  isLast: boolean
  editingId: string | null
  editTitle: string
  editDescription: string
  onEditTitleChange: (v: string) => void
  onEditDescriptionChange: (v: string) => void
  onStartEdit: (item: OutlineItem) => void
  onConfirmEdit: () => void
  onCancelEdit: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddChild: () => void
  onDelete: () => void
  onChildMoveUp: (id: string) => void
  onChildMoveDown: (id: string) => void
  onChildDelete: (id: string) => void
  onChildStartEdit: (child: OutlineItem) => void
}) {
  const isEditing = editingId === item.id
  const children = item.children || []

  return (
    <div>
      {/* section header */}
      <div className="flex items-start gap-3">
        <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => onEditTitleChange(e.target.value)}
                className="font-semibold"
              />
              <Input
                value={editDescription}
                onChange={(e) => onEditDescriptionChange(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={onConfirmEdit}>
                  儲存
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {item.number}、{item.title}
                <button
                  onClick={() => onStartEdit(item)}
                  className="ml-2 text-gray-400 hover:text-gray-700 inline-flex"
                  aria-label="編輯章節"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          )}
        </div>

        {/* action buttons (when not editing) */}
        {!isEditing && (
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isFirst}
              onClick={onMoveUp}
              aria-label="上移"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isLast}
              onClick={onMoveDown}
              aria-label="下移"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={onDelete}
              aria-label="刪除章節"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* children */}
      {children.length > 0 && (
        <div className="ml-8 mt-3 space-y-2">
          {children.map((child, cIdx) => {
            const isChildEditing = editingId === child.id
            return (
              <div
                key={child.id}
                className="border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3"
              >
                <div className="flex-1 min-w-0">
                  {isChildEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => onEditTitleChange(e.target.value)}
                        className="font-medium"
                      />
                      <Input
                        value={editDescription}
                        onChange={(e) => onEditDescriptionChange(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={onConfirmEdit}>
                          儲存
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {child.number} {child.title}
                      </h4>
                      <p className="text-sm text-gray-500">{child.description}</p>
                    </div>
                  )}
                </div>

                {!isChildEditing && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onChildStartEdit(child)}
                      aria-label="編輯項目"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={cIdx === 0}
                      onClick={() => onChildMoveUp(child.id)}
                      aria-label="上移"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      disabled={cIdx === children.length - 1}
                      onClick={() => onChildMoveDown(child.id)}
                      aria-label="下移"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onChildDelete(child.id)}
                      aria-label="刪除項目"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* add child link */}
      <div className="ml-8 mt-2">
        <button
          onClick={onAddChild}
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-4 h-4" />
          新增子項目
        </button>
      </div>
    </div>
  )
}

// --------------- tree utilities ---------------

function applyDeep(
  items: OutlineItem[],
  targetId: string,
  fn: (item: OutlineItem) => OutlineItem,
): OutlineItem[] {
  return items.map((item) => {
    if (item.id === targetId) return fn(item)
    if (item.children) {
      return { ...item, children: applyDeep(item.children, targetId, fn) }
    }
    return item
  })
}

function removeDeep(items: OutlineItem[], targetId: string): OutlineItem[] {
  return items
    .filter((item) => item.id !== targetId)
    .map((item) => {
      if (item.children) {
        return { ...item, children: removeDeep(item.children, targetId) }
      }
      return item
    })
}

function moveItem(items: OutlineItem[], targetId: string, direction: number): OutlineItem[] {
  const idx = items.findIndex((it) => it.id === targetId)
  if (idx !== -1) {
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= items.length) return items
    const copy = [...items]
    const [removed] = copy.splice(idx, 1)
    copy.splice(newIdx, 0, removed)
    return copy
  }
  return items.map((item) => {
    if (item.children) {
      return { ...item, children: moveItem(item.children, targetId, direction) }
    }
    return item
  })
}
