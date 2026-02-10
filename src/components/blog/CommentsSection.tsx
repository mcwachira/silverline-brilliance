"use client";

import { useState } from "react";
import { MessageCircle, ThumbsUp, Reply } from "lucide-react";
import Image from "next/image";
import { Comment } from "@/types/blog";
import { getTimeAgo } from "@/lib/blogUtils";
import { addComment } from "@/hooks/useBlogData";

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export default function CommentsSection({ postId, comments, onCommentAdded }: CommentsSectionProps) {
  const [formData, setFormData] = useState({
    author: "",
    email: "",
    website: "",
    content: "",
  });
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    if (!formData.author || !formData.email || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    addComment({
      postId,
      author: formData.author,
      email: formData.email,
      website: formData.website,
      content: formData.content,
      parentId,
    });

    setFormData({ author: "", email: "", website: "", content: "" });
    setReplyTo(null);
    onCommentAdded();
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex gap-4 ${isReply ? "ml-12 mt-4" : "mb-6"}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
          {comment.author.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-primary">{comment.author}</h4>
              <p className="text-xs text-gray-500">{getTimeAgo(comment.createdAt)}</p>
            </div>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center gap-4 text-sm">
          <button className="flex items-center gap-1 text-gray-600 transition-colors hover:text-accent">
            <ThumbsUp className="h-4 w-4" />
            <span>{comment.likes || 0}</span>
          </button>
          {!isReply && (
            <button
              onClick={() => setReplyTo(comment.id)}
              className="flex items-center gap-1 text-gray-600 transition-colors hover:text-accent"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyTo === comment.id && (
          <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-4">
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your reply..."
              rows={3}
              className="w-full rounded-lg border border-border p-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:shadow-lg"
              >
                Post Reply
              </button>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.map((reply) => (
          <CommentItem key={reply.id} comment={reply} isReply />
        ))}
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <MessageCircle className="h-8 w-8 text-accent" />
        <h2 className="text-3xl font-bold text-primary">
          Join the Conversation
          <span className="ml-2 text-xl text-gray-500">({comments.length})</span>
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="mb-12 rounded-2xl border border-border bg-white p-6 shadow-lg">
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Name *"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
            className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <input
            type="url"
            placeholder="Website (optional)"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="rounded-lg border border-border px-4 py-2.5 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <textarea
          placeholder="Your comment *"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={5}
          className="mb-4 w-full rounded-lg border border-border p-4 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Your email won't be published</p>
          <button
            type="submit"
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-lg transition-all hover:shadow-accent/50"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-gray-50 p-12 text-center">
            <MessageCircle className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>
    </section>
  );
}
