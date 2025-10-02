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

interface Experience {
  id: string;
  brand_name: string;
  brand_domain: string;
  logo_url: string;
  review_text: string;
  rating: number;
  created_at: string;
  user_id: string;
  firmographics?: any;
}

export default function BrandProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      if (fetchedBrand.website_url) {
        const domain = fetchedBrand.website_url
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, "");
        fetchExperiences(domain);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load brand profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async (brandDomain: string) => {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("brand_domain", brandDomain)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching experiences:", error);
    } else {
      setExperiences(data || []);
    }

    // Real-time listener
    supabase
      .from("experiences")
      .on("INSERT", (payload) => {
        setExperiences((prev) => [payload.new as Experience, ...prev]);
      })
      .subscribe();
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

                <div className="flex items-center space-x-6 text-sm text-gray-500">
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
                    Joined {new Date(brand.created_at).toLocaleDateString()}
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
              <CardTitle className="text-sm font-medium">
                BrandBlasts
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {brand.brand_blasts}
              </div>
              <p className="text-xs text-muted-foreground">Negative experience</p>
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
              <p className="text-xs text-muted-foreground">Positive experiences</p>
            </CardContent>
          </Card>
        </div>

        {/* User Experiences */}
        <Card>
          <CardHeader>
            <CardTitle>User Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            {experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id}>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={exp.logo_url} alt={exp.brand_name} />
                        <AvatarFallback>
                          {exp.brand_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">
                            {exp.brand_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(exp.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {exp.review_text}
                        </p>
                        <p className="text-xs text-yellow-500">
                          ⭐ {exp.rating}/5
                        </p>
                      </div>
                    </div>

                    {index < experiences.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No experiences yet for this brand.
                </p>
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
