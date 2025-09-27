import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Eye,
  X,
  Image,
  Video,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { BrandLogoFetcher } from "./BrandLogoFetcher";
import SuccessNotification from "./SuccessNotification";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface Tell {
  id: string;
  title: string;
  content: string;
  brand_name: string;
  category: string;
  rating: number;
  created_at: string;
  country?: string;
  user_id: string;
  user_name?: string;
  likes_count?: number;
  comments_count?: number;
  tell_type?: "BrandBeat" | "BrandBlast";
  brandBlastsCount?: number;
  brandBeatsCount?: number;
  evidence_urls?: string[];
  image_url?: string;
}

interface Comment {
  id: string | number;
  content: string;
  created_at: string;
  user_id?: string;
  user_name: string;
}

interface TellCardWithUserPhotoProps {
  tell: Tell;
  onClick?: () => void;
  shouldOpenComments?: boolean;
}

const TELLER_PLACEHOLDER =
  "https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757134664984_8ba0be21.png";

export default function TellCardWithUserPhoto({
  tell,
  onClick,
  shouldOpenComments = false,
}: TellCardWithUserPhotoProps) {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useUserProfile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [isReadCommentsOpen, setIsReadCommentsOpen] = useState(false);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likesCount, setLikesCount] = useState<number>(tell.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);

  // Process media items from evidence_urls and image_url
  const mediaItems: MediaItem[] = React.useMemo(() => {
    const items: MediaItem[] = [];

    // Add evidence_urls
    if (tell.evidence_urls && tell.evidence_urls.length > 0) {
      tell.evidence_urls.forEach((url) => {
        if (url) {
          const isVideo =
            url.includes(".mp4") ||
            url.includes(".mov") ||
            url.includes(".webm") ||
            url.includes(".avi");
          items.push({
            url,
            type: isVideo ? "video" : "image",
          });
        }
      });
    }

    // Add legacy image_url if not already in evidence_urls
    if (tell.image_url && !tell.evidence_urls?.includes(tell.image_url)) {
      items.push({
        url: tell.image_url,
        type: "image",
      });
    }

    return items;
  }, [tell.evidence_urls, tell.image_url]);

  const imageItems = mediaItems.filter((item) => item.type === "image");
  const videoItems = mediaItems.filter((item) => item.type === "video");

  // Handle shouldOpenComments prop
  useEffect(() => {
    if (shouldOpenComments && comments.length >= 0) {
      setTimeout(() => {
        if (comments.length > 0) {
          setIsReadCommentsOpen(true);
        }
      }, 500);
    }
  }, [shouldOpenComments, comments.length]);

  // Fetch user photo
  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        if (userProfile && tell.user_id === userProfile.id) {
          setUserPhoto(userProfile.avatar_url || TELLER_PLACEHOLDER);
          setLoading(false);
          return;
        }

        const { data: userData } = await supabase
          .from("users")
          .select("avatar_url, full_name")
          .eq("id", tell.user_id)
          .single();

        setUserPhoto(userData?.avatar_url || TELLER_PLACEHOLDER);
      } catch {
        setUserPhoto(TELLER_PLACEHOLDER);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPhoto();
  }, [tell.user_id, userProfile]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("id, content, created_at, user_id")
          .eq("tell_id", tell.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching comments:", error);
          return;
        }

        const userNames = await Promise.all(
          data.map(async (comment) => {
            const { data: userData } = await supabase
              .from("users")
              .select("full_name")
              .eq("id", comment.user_id)
              .single();
            return userData?.full_name || "Anonymous User";
          })
        );

        setComments(
          data.map((comment, index) => ({
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            user_id: comment.user_id,
            user_name: userNames[index],
          }))
        );

        setCommentsCount(data.length);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [tell.id]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!userProfile) return;
      const { data, error } = await supabase
        .from("likes")
        .select("id")
        .eq("tell_id", tell.id)
        .eq("user_id", userProfile.id)
        .single();

      if (error) {
        console.error("Error checking if liked:", error);
        return;
      }

      if (data) {
        setHasLiked(true);
      }
    };

    checkIfLiked();
  }, [userProfile, tell.id]);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const { data, error } = await supabase
          .from("likes")
          .select("id")
          .eq("tell_id", tell.id);

        if (error) {
          console.error("Error fetching likes:", error);
          return;
        }

        setLikesCount(data.length);
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };

    fetchLikesCount();
  }, [tell.id]);

  const handleLike = async () => {
    if (!userProfile) {
      alert("Please sign in to like this tell.");
      return;
    }

    if (hasLiked) {
      alert("You have already liked this tell.");
      return;
    }

    try {
      const { error } = await supabase.from("likes").insert([
        {
          tell_id: tell.id,
          user_id: userProfile.id,
        },
      ]);

      if (error) throw error;

      setLikesCount(likesCount + 1);
      setHasLiked(true);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error liking tell:", error);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatCommentDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleCommentSubmit = async () => {
    try {
      if (!commentText.trim()) return;

      if (!userProfile) {
        alert("Please sign in to comment.");
        return;
      }

      const { error } = await supabase.from("comments").insert([
        {
          tell_id: tell.id,
          user_id: userProfile?.id,
          content: commentText.trim(),
        },
      ]);

      if (error) throw error;

      const newComment: Comment = {
        id: Date.now(),
        content: commentText.trim(),
        created_at: new Date().toISOString(),
        user_name: userProfile?.full_name || "Anonymous",
        user_id: userProfile?.id,
      };

      setComments([newComment, ...comments]);
      setCommentsCount((prev) => prev + 1);
      setIsCommentPopupOpen(false);
      setCommentText("");

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentPopupOpen(true);
  };

  const handleReadCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReadCommentsOpen(true);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const firstImageIndex = mediaItems.findIndex(
      (item) => item.type === "image"
    );
    const isCurrentlyOnImage = mediaItems[currentMediaIndex]?.type === "image";
    // Preserve current image index if already on an image; otherwise start from the first image
    setCurrentMediaIndex(
      isCurrentlyOnImage && currentMediaIndex >= 0
        ? currentMediaIndex
        : firstImageIndex >= 0
        ? firstImageIndex
        : 0
    );
    setIsMediaViewerOpen(true);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const firstVideoIndex = mediaItems.findIndex(
      (item) => item.type === "video"
    );
    const isCurrentlyOnVideo = mediaItems[currentMediaIndex]?.type === "video";
    // Preserve current video index if already on a video; otherwise start from the first video
    setCurrentMediaIndex(
      isCurrentlyOnVideo && currentMediaIndex >= 0
        ? currentMediaIndex
        : firstVideoIndex >= 0
        ? firstVideoIndex
        : 0
    );
    setIsMediaViewerOpen(true);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const previousMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  return (
    <>
      <Card
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:shadow-xl hover:-translate-y-1"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Avatar */}
              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                <AvatarImage
                  src={
                    loading
                      ? TELLER_PLACEHOLDER
                      : userPhoto || TELLER_PLACEHOLDER
                  }
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {tell.user_name?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* User name and country */}
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-900">
                    {tell.user_name || "Anonymous Teller"}{" "}
                  </div>

                  {tell.tell_type === "BrandBlast" ? (
                    <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <ThumbsDown className="w-3 h-3" /> BrandBlast
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <ThumbsUp className="w-3 h-3" /> BrandBeat
                    </div>
                  )}
                </div>

                {/* BrandBlast and BrandBeat Counts below Tell Type */}
                <div className="flex items-center gap-1 text-[0.6rem] text-gray-600 md:justify-self-end">
                  <span>👎 {tell.brandBlastsCount || 0} BrandBlasts</span>
                  <span>👍 {tell.brandBeatsCount || 0} BrandBeats</span>
                </div>

                {/* Brand Name */}
                <div className="text-sm flex items-center space-x-2 mt-3 font-medium text-blue-600 mb-2 sm:-mt-4">
                  <div className="text-sm font-medium text-blue-600 truncate max-w-[120px] sm:max-w-[200px]">
                    {tell.brand_name}
                  </div>

                  {/* Country with consistent bracketed format */}
                  {tell.country && (
                    <div className="text-xs text-blue-600">
                      ({tell.country})
                    </div>
                  )}
                </div>

                {/* Tell Title */}
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tell.title}
                </h3>

                {/* Content */}
                <p className="text-sm text-gray-600 mb-3">
                  {isExpanded
                    ? tell.content
                    : `${tell.content?.slice(0, 150)}...`}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {isExpanded ? "View Less" : "View More"}
                </button>

                {/* Media Icons */}
                {mediaItems.length > 0 && (
                  <div className="flex items-center gap-3 mt-3 mb-2">
                    {imageItems.length > 0 && (
                      <button
                        onClick={handleImageClick}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Image className="h-4 w-4" />
                        <span>
                          {imageItems.length} Image
                          {imageItems.length > 1 ? "s" : ""}
                        </span>
                      </button>
                    )}
                    {videoItems.length > 0 && (
                      <button
                        onClick={handleVideoClick}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        <Video className="h-4 w-4" />
                        <span>
                          {videoItems.length} Video
                          {videoItems.length > 1 ? "s" : ""}
                        </span>
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(tell.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp
                      className="h-4 w-4 cursor-pointer"
                      onClick={handleLike}
                    />
                    <span>{likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle
                      className="h-4 w-4 cursor-pointer hover:text-blue-600"
                      onClick={handleCommentIconClick}
                    />
                    <span>{commentsCount}</span>
                  </div>

                  {commentsCount > 0 && (
                    <div className="flex items-center gap-1 w-full sm:w-auto">
                      <Eye className="h-4 w-4" />
                      <button
                        onClick={handleReadCommentsClick}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Read Comments
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <BrandLogoFetcher
                brandName={tell.brand_name}
                className="w-12 h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Viewer Modal (Portal) */}
      {isMediaViewerOpen &&
        mediaItems.length > 0 &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="relative max-w-4xl max-h-screen w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={() => setIsMediaViewerOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="h-8 w-8" />
              </button>

              {/* Navigation Buttons */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={previousMedia}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}

              {/* Media Content */}
              <div className="flex items-center justify-center w-full h-full">
                {mediaItems[currentMediaIndex]?.type === "image" ? (
                  <img
                    src={mediaItems[currentMediaIndex].url}
                    alt="Tell media"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video
                    src={mediaItems[currentMediaIndex]?.url}
                    controls
                    className="max-w-full max-h-full object-contain"
                    autoPlay
                  />
                )}
              </div>

              {/* Media Counter */}
              {mediaItems.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentMediaIndex + 1} / {mediaItems.length}
                </div>
              )}

              {/* Media Type Indicator */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {mediaItems[currentMediaIndex]?.type === "image" ? (
                  <>
                    <Image className="h-4 w-4" /> Image
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" /> Video
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Comment Popup */}
      {isCommentPopupOpen &&
        createPortal(
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">
                Submit Your Comment
              </h2>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Write your comment here..."
              />
              <div className="flex justify-end">
                <button
                  onClick={handleCommentSubmit}
                  className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsCommentPopupOpen(false)}
                  className="ml-2 bg-gray-300 text-black hover:bg-gray-400 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Read Comments Popup */}
      {isReadCommentsOpen &&
        createPortal(
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">
                  Comments ({commentsCount})
                </h2>
                <button
                  onClick={() => setIsReadCommentsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Comments List */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-b border-gray-100 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {comment.user_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {comment.user_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatCommentDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50">
                <button
                  onClick={() => {
                    setIsReadCommentsOpen(false);
                    setIsCommentPopupOpen(true);
                  }}
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Add a Comment
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Success Notification */}
      <SuccessNotification
        show={showSuccess}
        message="Thank you for your feedback."
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
