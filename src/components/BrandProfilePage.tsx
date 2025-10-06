import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle,
  Globe,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { BrandLogoFetcher } from "./BrandLogoFetcher";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  website_url?: string;
  verified: boolean;
  brand_blasts: number;
  brand_beats: number;
  created_at: string;
  firmographics?: any;
}

interface Tell {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  tell_type: string;
  user_id: string;
  brand_id: string;
  country: string;
  brand_name: string;
  image_url?: string;
  evidence_urls?: string[];
  user_name?: string;
  user_avatar?: string;
}

const TELLER_PLACEHOLDER = "https://via.placeholder.com/40";

export default function BrandProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [tells, setTells] = useState<Tell[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBrandProfile();
    }
  }, [slug]);

  const fetchBrandProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke(
        "brand-management",
        {
          body: { action: "get_by_slug", slug },
        }
      );

      if (error) throw error;
      console.log("data", data);
      console.log("error", error);
      if (!data.success) throw new Error(data.error);

      const fetchedBrand = data.brand;
      setBrand(fetchedBrand);

      // Fetch tells for this brand
      fetchTells(fetchedBrand.id, fetchedBrand.name);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load brand profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTells = async (brandId: string, brandName: string) => {
    try {
      // Fetch tells by brand_id or brand_name
      const { data: tellsData, error: tellsError } = await supabase
        .from("tells")
        .select(
          `
          id,
          title,
          content,
          status,
          created_at,
          tell_type,
          user_id,
          brand_id,
          country,
          brand_name,
          image_url,
          evidence_urls
        `
        )
        .or(`brand_id.eq.${brandId},brand_name.eq.${brandName}`)
        .order("created_at", { ascending: false });

      if (tellsError) throw tellsError;

      // Fetch users data to get user names
      const userIds = [
        ...new Set(tellsData?.map((tell) => tell.user_id) || []),
      ];

      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, full_name, avatar_url")
          .in("id", userIds);

        if (usersError) {
          console.warn("Error fetching users:", usersError);
        }

        // Map user names and avatars to tells
        const tellsWithUser = (tellsData || []).map((tell) => {
          const user = (usersData || []).find((u) => u.id === tell.user_id);
          return {
            ...tell,
            user_name: user ? user.full_name : "Anonymous User",
            user_avatar: user?.avatar_url || TELLER_PLACEHOLDER,
          };
        });

        setTells(tellsWithUser);
      } else {
        setTells(tellsData || []);
      }

      // Set up real-time listener for new tells
      const subscription = supabase
        .channel(`tells-${brandId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "tells",
            filter: `brand_id=eq.${brandId}`,
          },
          (payload) => {
            setTells((prev) => [payload.new as Tell, ...prev]);
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error("Error fetching tells:", err);
      setTells([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading brand profile...</p>
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Brand Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "This brand profile does not exist."}
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Brand Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <BrandLogoFetcher
                  brandName={brand.name}
                  className="w-12 h-12"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {brand.name}
                  </h1>
                  {brand.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {brand.description && (
                  <p className="text-gray-600 mb-4">{brand.description}</p>
                )}

                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center space-x-6">
                    {brand.website_url && (
                      <a
                        href={brand.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-blue-600"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Fetched {new Date(brand.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* ✅ Add total Tells below */}
                  <div className="flex items-center text-gray-700 font-medium">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                    Tells: {brand.brand_blasts + brand.brand_beats}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BrandBlasts</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {brand.brand_blasts}
              </div>
              <p className="text-xs text-muted-foreground">
                Negative experiences
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BrandBeats</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {brand.brand_beats}
              </div>
              <p className="text-xs text-muted-foreground">
                Positive experiences
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Tells/Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Tells</CardTitle>
          </CardHeader>
          <CardContent>
            {tells.length > 0 ? (
              <div className="space-y-4">
                {tells.map((tell, index) => (
                  <div key={tell.id}>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={tell.user_avatar || TELLER_PLACEHOLDER}
                          alt={tell.user_name || "User"}
                        />
                        <AvatarFallback>
                          {tell.user_name
                            ? tell.user_name.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {tell.user_name || "Anonymous User"}
                          </span>
                          <Badge
                            variant={
                              tell.tell_type === "BrandBlast"
                                ? "destructive"
                                : "default"
                            }
                            className={
                              tell.tell_type === "BrandBlast"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {tell.tell_type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(tell.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {tell.title && (
                          <h4 className="font-semibold text-sm mb-1">
                            {tell.title}
                          </h4>
                        )}

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
                        {tell.image_url && (
                          <img
                            src={tell.image_url}
                            alt="Evidence"
                            className="mt-2 rounded-lg max-w-xs max-h-48 object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {index < tells.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet for this brand.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Be the first to share your experience!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
