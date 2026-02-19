"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { sanityClient, CATEGORIES_QUERY, AUTHORS_QUERY } from '@/src/sanity/lib/sanity'
import { type SanityCategory, type SanityAuthor, type PostFormData, slugify } from '@/types/types'
import BlogPostEditor from '@/src/components/admin/blog/BlogPostEditor'


export default function NewBlogPostPage(){
     const router = useRouter()
  const [categories, setCategories] = useState<SanityCategory[]>([])
  const [authors, setAuthors]       = useState<SanityAuthor[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load(){
        try{
            const [cats, auths] = await Promise.all([
                 sanityClient.fetch(CATEGORIES_QUERY),
          sanityClient.fetch(AUTHORS_QUERY),
            ])
            setCategories(cats)
        setAuthors(auths)
        } catch{
            toast.error("Failed to load categories/authors")
        }finally{
            setLoading(false)
        }
    }

    load()
  }, [])

  async function handleSave(data: PostFormData, publish: boolean) {
    const slug = data.slug || slugify(data.title)

    const doc: Record<string, unknown> = {
      _type: 'blogPost',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      excerpt: data.excerpt || undefined,
      tags: data.tags,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      author: data.authorId
        ? { _type: 'reference', _ref: data.authorId }
        : undefined,
      categories: data.categoryIds.map(id => ({ _type: 'reference', _ref: id })),
      publishedAt: publish ? new Date().toISOString() : undefined,
    }

    const created = await sanityClient.create(doc)
    toast.success(publish ? 'Post published!' : 'Draft saved!')
    router.push(`/dashboard/blog/${created._id}`)
  }

  return (
    <BlogPostEditor
      mode="create"
      categories={categories}
      authors={authors}
      loadingMeta={loading}
      onSave={handleSave}
    />
  )
}

