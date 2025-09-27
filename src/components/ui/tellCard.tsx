import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp } from "lucide-react";
import { BrandLogoFetcher } from "../BrandLogoFetcher";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { useUserProfile } from "@/contexts/UserProfileContext"; // Get user profile context

interface Tell {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  brand_name?: string;
  brands?: {
    name: string;
  };
}

interface TellCardProps {
  tell: Tell;
  getStatusBadge: (status: string) => React.ReactNode;
}

const TellCard: React.FC<TellCardProps> = ({ tell, getStatusBadge }) => {
  const [expanded, setExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false); // To track if the user has liked
  const [commentText, setCommentText] = useState(""); // For storing comment text
  const [showSuccess, setShowSuccess] = useState(false); // Success message after like or comment
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false); // Modal for comments

  const { userProfile } = useUserProfile(); // Get current user profile

  // Fetch likes count for the tell
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

        setLikesCount(data.length); // Set the total number of likes
      } catch (error) {
        console.error("Error fetching likes count:", error);
      }
    };

    fetchLikesCount();
  }, [tell.id]);

  // Fetch comments count for the tell
  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("id")
          .eq("tell_id", tell.id);

        if (error) {
          console.error("Error fetching comments:", error);
          return;
        }

        setCommentsCount(data.length); // Set the total number of comments
      } catch (error) {
        console.error("Error fetching comments count:", error);
      }
    };

    fetchCommentsCount();
  }, [tell.id]);

  // Check if the user has already liked the tell
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
        setHasLiked(true); // If the user has liked the tell, set hasLiked to true
      }
    };

    checkIfLiked();
  }, [userProfile, tell.id]);

  // Like the tell
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

      setLikesCount(likesCount + 1); // Update the likes count
      setHasLiked(true); // Mark the tell as liked by the user

      // Notify success
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error liking tell:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return; // If no comment is entered, do nothing

    if (!userProfile) {
      alert("Please sign in to comment.");
      return;
    }

    try {
      const { error } = await supabase.from("comments").insert([
        {
          tell_id: tell.id,
          user_id: userProfile.id,
          content: commentText.trim(),
        },
      ]);

      if (error) throw error;

      // Update comments count
      setCommentsCount(commentsCount + 1);
      setCommentText(""); // Clear comment input field

      // Notify success
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      // Close comment modal after submission
      setIsCommentModalOpen(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const preview =
    tell.content.length > 150 && !expanded
      ? tell.content.slice(0, 150) + "..."
      : tell.content;

  return (
    <>
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          {/* Brand + Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BrandLogoFetcher
                brandName={tell.brand_name || "Unknown Brand"}
                className="w-10 h-10"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {tell.brand_name || "Unknown Brand"}
                </h3>
                <p className="text-xs text-gray-500">
                  {new Date(tell.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {getStatusBadge(tell.status)}
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {tell.title}
          </h4>

          {/* Content */}
          <p className="text-sm text-gray-700 mb-3">{preview}</p>

          {/* Like and Comment Footer */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
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
                onClick={() => setIsCommentModalOpen(true)}
              />
              <span>{commentsCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Submit Your Comment</h2>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Write your comment here..."
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCommentSubmit}
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-4 py-2"
              >
                Submit
              </Button>
              <Button
                onClick={() => setIsCommentModalOpen(false)}
                className="ml-2 bg-gray-300 text-black hover:bg-gray-400 font-semibold px-4 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-full shadow-lg">
          Success! Your action has been submitted.
        </div>
      )}
    </>
  );
};

export default TellCard;
