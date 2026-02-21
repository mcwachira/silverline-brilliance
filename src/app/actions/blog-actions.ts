'use server'

// actions/blog-actions.ts

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/src/lib/supabase/server'
import {
  publishBlogPost as publishPost, unpublishBlogPost as unpublishPost, duplicateBlogPost as duplicatePost, deleteBlogPost as deletePost, updateBlogPost as updatePost
} from '@/src/sanity/lib/sanity'

async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorised')
  return user
}

export async function publishBlogPost(postId: string) {
  await requireAdmin()
  try {
    await publishPost(postId)
    revalidatePath('/dashboard/blog')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function unpublishBlogPost(postId: string) {
  await requireAdmin()
  try {
    await unpublishPost(postId)
    revalidatePath('/dashboard/blog')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function duplicateBlogPost(postId: string) {
  await requireAdmin()
  try {
    await duplicatePost(postId)
    revalidatePath('/dashboard/blog')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteBlogPost(postId: string) {
  await requireAdmin()
  try {
    await deletePost(postId)
    revalidatePath('/dashboard/blog')
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateBlogPost(postId: string, data: Record<string, unknown>) {
  await requireAdmin()
  try {
    await updatePost(postId, data)
    revalidatePath('/dashboard/blog')
    revalidatePath(`/dashboard/blog/${postId}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}