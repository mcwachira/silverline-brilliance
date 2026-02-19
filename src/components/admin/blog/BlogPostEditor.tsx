'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import type { BlogPost, SanityCategory, SanityAuthor } from '@/types'
import { getBlogStatus } from '@/types/types'
import type { PostFormData } from '@/app/dashboard/blog/new/page'
import { slugify } from '@/app/dashboard/blog/new/page'
import {
  ArrowLeft, Save, Globe, Eye, EyeOff,
  Loader2, Plus, X, Hash, ChevronDown
} from 'lucide-react'

interface Props {
  mode: 'create' | 'edit'
  post?: BlogPost
  categories: SanityCategory[]
  authors: SanityAuthor[]
  loadingMeta: boolean
  onSave: (data: PostFormData, publish: boolean) => Promise<void>
}

export default function BlogPostEditor({ mode, post, categories, authors, loadingMeta, onSave }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saveType, setSaveType]      = useState<'draft' | 'publish' | null>(null)
  const [tagInput, setTagInput]      = useState('')

  const isPublished = post ? getBlogStatus(post) === 'published' : false

  // ── Form state (seeded from existing post if editing) ──────────
  const [form, setForm] = useState<PostFormData>({
    title:          post?.title ?? '',
    slug:           post?.slug?.current ?? '',
    excerpt:        post?.excerpt ?? '',
    authorId:       post?.author?._id ?? '',
    categoryIds:    post?.categories?.map(c => c._id) ?? [],
    tags:           post?.tags ?? [],
    metaTitle:      post?.metaTitle ?? '',
    metaDescription: post?.metaDescription ?? '',
  })

  const [slugManual, setSlugManual] = useState(mode === 'edit')

  // ── Helpers ────────────────────────────────────────────────────
  function set<K extends keyof PostFormData>(key: K, val: PostFormData[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleTitleChange(title: string) {
    set('title', title)
    if (!slugManual) set('slug', slugify(title))
  }

  function toggleCategory(id: string) {
    set('categoryIds',
      form.categoryIds.includes(id)
        ? form.categoryIds.filter(c => c !== id)
        : [...form.categoryIds, id]
    )
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!t) return
    if (form.tags.includes(t)) { toast.error('Tag already added'); return }
    set('tags', [...form.tags, t])
    setTagInput('')
  }

  function removeTag(t: string) { set('tags', form.tags.filter(x => x !== t)) }

  function validate(): boolean {
    if (!form.title.trim()) { toast.error('Title is required'); return false }
    if (!form.slug.trim())  { toast.error('Slug is required'); return false }
    return true
  }

  function handleSubmit(publish: boolean) {
    if (!validate()) return
    setSaveType(publish ? 'publish' : 'draft')
    startTransition(async () => {
      try {
        await onSave(form, publish)
      } catch (e) {
        toast.error((e as Error).message ?? 'Save failed')
      } finally {
        setSaveType(null)
      }
    })
  }

  const busy = isPending

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Header ── */}
      <div className="page-header flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/blog" className="btn-ghost p-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="page-title">
              {mode === 'create' ? 'New Post' : 'Edit Post'}
            </h1>
            <p className="page-subtitle">
              {mode === 'edit' && post
                ? isPublished
                  ? '✅ Published · changes save immediately'
                  : '📝 Draft'
                : 'Manage in Sanity Studio for rich text editing'
              }
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {mode === 'edit' && post && (
            <a
              href={`${process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? ''}/desk/blogPost;${post._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              <Eye className="w-4 h-4" /> Open in Studio
            </a>
          )}

          <button
            onClick={() => handleSubmit(false)}
            disabled={busy}
            className="btn-secondary text-sm"
          >
            {busy && saveType === 'draft'
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> Save Draft</>
            }
          </button>

          <button
            onClick={() => handleSubmit(true)}
            disabled={busy}
            className="btn-primary text-sm"
          >
            {busy && saveType === 'publish'
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
              : isPublished
                ? <><EyeOff className="w-4 h-4" /> Update & Keep Published</>
                : <><Globe className="w-4 h-4" /> Publish</>
            }
          </button>
        </div>
      </div>

      {/* ── Two column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Title */}
          <div className="card p-5 space-y-4">
            <div>
              <label className="label">Post Title *</label>
              <input
                className="input text-base"
                placeholder="Enter a compelling title..."
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-faint)' }}>
                {form.title.length}/100
              </p>
            </div>

            {/* Slug */}
            <div>
              <label className="label">
                URL Slug *
                <span className="ml-2 text-xs normal-case" style={{ color: 'var(--text-faint)' }}>
                  yoursite.com/blog/<strong style={{ color: 'var(--gold)' }}>{form.slug || 'post-slug'}</strong>
                </span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
                  <input
                    className="input pl-8 font-mono text-sm"
                    placeholder="post-slug"
                    value={form.slug}
                    onChange={e => { setSlugManual(true); set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')) }}
                  />
                </div>
                {slugManual && (
                  <button
                    type="button"
                    className="btn-ghost text-xs whitespace-nowrap"
                    onClick={() => { setSlugManual(false); set('slug', slugify(form.title)) }}
                  >
                    Auto
                  </button>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="label">Excerpt <span style={{ color: 'var(--text-faint)' }}>(shown in blog list)</span></label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="A short description that appears in the blog listing..."
                value={form.excerpt}
                onChange={e => set('excerpt', e.target.value)}
                maxLength={300}
              />
              <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-faint)' }}>
                {form.excerpt.length}/300
              </p>
            </div>
          </div>

          {/* Rich text notice */}
          <div className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)' }}>
            <span className="text-xl flex-shrink-0">✍️</span>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--gold)' }}>Rich Text Content</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                Your post body uses Sanity's Portable Text editor which isn't embeddable here.
                {mode === 'create'
                  ? ' Save the draft first, then click "Open in Studio" to write the full content.'
                  : ' Use the "Open in Studio" button above to edit the post body.'
                }
              </p>
            </div>
          </div>

          {/* SEO */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text)', fontFamily: 'Playfair Display,serif' }}>
              SEO Settings
            </h3>
            <div>
              <label className="label">Meta Title <span style={{ color: 'var(--text-faint)' }}>(60 chars ideal)</span></label>
              <input
                className="input"
                placeholder="SEO title — defaults to post title if blank"
                value={form.metaTitle}
                onChange={e => set('metaTitle', e.target.value)}
                maxLength={70}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs" style={{ color: form.metaTitle.length > 60 ? '#FFC107' : 'var(--text-faint)' }}>
                  {form.metaTitle.length > 60 ? '⚠ Getting long' : ''}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{form.metaTitle.length}/70</p>
              </div>
            </div>
            <div>
              <label className="label">Meta Description <span style={{ color: 'var(--text-faint)' }}>(160 chars ideal)</span></label>
              <textarea
                className="input resize-none"
                rows={2}
                placeholder="Description shown in Google search results..."
                value={form.metaDescription}
                onChange={e => set('metaDescription', e.target.value)}
                maxLength={180}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs" style={{ color: form.metaDescription.length > 160 ? '#FFC107' : 'var(--text-faint)' }}>
                  {form.metaDescription.length > 160 ? '⚠ Getting long' : ''}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{form.metaDescription.length}/180</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar column ── */}
        <div className="space-y-5">

          {/* Author */}
          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Author</h3>
            {loadingMeta ? (
              <div className="h-9 rounded animate-pulse bg-white/5" />
            ) : (
              <div className="relative">
                <select
                  className="input appearance-none pr-8"
                  value={form.authorId}
                  onChange={e => set('authorId', e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <option value="">No author selected</option>
                  {authors.map(a => (
                    <option key={a._id} value={a._id} style={{ background: 'var(--surface)' }}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-faint)' }} />
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
              Categories
            </h3>
            {loadingMeta ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-8 rounded animate-pulse bg-white/5" />)}
              </div>
            ) : categories.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                No categories yet. Add them in Sanity Studio.
              </p>
            ) : (
              <div className="space-y-1.5">
                {categories.map(cat => {
                  const checked = form.categoryIds.includes(cat._id)
                  return (
                    <label
                      key={cat._id}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <div
                        onClick={() => toggleCategory(cat._id)}
                        className={`flex-shrink-0 w-4 h-4 rounded transition-all ${
                          checked ? 'bg-purple-500 border-purple-500' : 'border border-white/20 bg-white/5'
                        } flex items-center justify-center`}
                        style={checked ? { background: 'var(--purple)', borderColor: 'var(--purple)' } : {}}
                      >
                        {checked && <span className="text-white text-xs leading-none">✓</span>}
                      </div>
                      <span
                        className="text-sm transition-colors"
                        style={{ color: checked ? 'var(--text)' : 'var(--text-muted)' }}
                        onClick={() => toggleCategory(cat._id)}
                      >
                        {cat.name}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Tags</h3>

            {/* Existing tags */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'rgba(255,215,0,0.1)',
                      color: 'var(--gold)',
                      border: '1px solid rgba(255,215,0,0.25)'
                    }}
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors ml-0.5">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add tag */}
            <div className="flex gap-2">
              <input
                className="input text-sm flex-1"
                placeholder="Add tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              />
              <button type="button" onClick={addTag} className="btn-secondary p-2 flex-shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Press Enter or + to add</p>
          </div>

          {/* Post status summary */}
          {mode === 'edit' && post && (
            <div className="card p-4 space-y-2 text-xs" style={{ color: 'var(--text-faint)' }}>
              <h3 className="font-semibold uppercase tracking-wider">Post Info</h3>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span style={{ color: isPublished ? '#28A745' : 'var(--text-muted)' }}>
                    {isPublished ? '● Published' : '○ Draft'}
                  </span>
                </div>
                {post.publishedAt && (
                  <div className="flex justify-between">
                    <span>Published</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Created</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {new Date(post._createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {new Date(post._updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}