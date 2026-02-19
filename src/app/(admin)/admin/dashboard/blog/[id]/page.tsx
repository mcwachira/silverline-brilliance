'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { sanityClient, BLOG_POST_BY_ID_QUERY, CATEGORIES_QUERY, AUTHORS_QUERY } from '@/src/sanity/lib/sanity'
import type { BlogPost, SanityCategory, SanityAuthor } from '@/types/types'
import BlogPostEditor from '@/src/components/admin/blog/BlogPostEditor'
import type { PostFormData } from '@/types/types'

export default function EditBlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params.id as string

  const [post, setPost]           = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<SanityCategory[]>([])
  const [authors, setAuthors]       = useState<SanityAuthor[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [p, cats, auths] = await Promise.all([
          sanityClient.fetch(BLOG_POST_BY_ID_QUERY, { id }),
          sanityClient.fetch(CATEGORIES_QUERY),
          sanityClient.fetch(AUTHORS_QUERY),
        ])
        if (!p) { toast.error('Post not found'); router.push('/dashboard/blog'); return }
        setPost(p)
        setCategories(cats)
        setAuthors(auths)
      } catch {
        toast.error('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleSave(data: PostFormData, publish: boolean) {
    const updates: Record<string, unknown> = {
      title: data.title,
      slug: { _type: 'slug', current: data.slug },
      excerpt: data.excerpt || undefined,
      tags: data.tags,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      author: data.authorId
        ? { _type: 'reference', _ref: data.authorId }
        : undefined,
      categories: data.categoryIds.map(rid => ({ _type: 'reference', _ref: rid })),
    }

    // Only set publishedAt if publishing and not already published
    if (publish && !post?.publishedAt) {
      updates.publishedAt = new Date().toISOString()
    }
    // Allow unpublishing (explicit null)
    if (!publish && post?.publishedAt) {
      await sanityClient.patch(id).unset(['publishedAt']).commit()
    }

    await sanityClient.patch(id).set(updates).commit()
    toast.success(publish ? 'Post published!' : 'Draft saved!')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl animate-pulse">
        <div className="h-8 rounded-lg w-48 bg-white/5" />
        <div className="card h-96 bg-white/[0.02]" />
      </div>
    )
  }

  if (!post) return null

  return (
    <BlogPostEditor
      mode="edit"
      post={post}
      categories={categories}
      authors={authors}
      loadingMeta={false}
      onSave={handleSave}
    />
  )
}