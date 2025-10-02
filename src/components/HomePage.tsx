import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  TrendingUp,
  MessageSquare,
  Heart,
  CheckCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TellCardWithUserPhoto from "./TellCardWithUserPhoto";
import FeaturesSection from "./FeaturesSection";
import AwardAnnouncement from "./AwardAnnouncement";
import TrendingBrands from "./TrendingBrands";
import AwardNotificationBanner from "./AwardNotificationBanner";

import DynamicHeroBanner from "./DynamicHeroBanner";
import { useLocation } from "@/hooks/useLocation";
import { supabase } from "@/lib/supabase";
import { BrandLogoFetcher } from "./BrandLogoFetcher";
import { createSlug } from "@/lib/utils";

// Interface for Tell data
interface Tell {
  id: string;
  title: string;
  content: string;
  tell_type: "BrandBlast" | "BrandBeat";
  brand_name: string | null;
  user_id: string;
  status:
    | "pending"
    | "published"
    | "rejected"
    | "open"
    | "resolved"
    | "in_progress";
  created_at: string;
}

interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  tellsCount: number;
  type: string;
  category: string;
  brandblaststCount: number;
  brandbeatsCount: number;
}

interface HomePageProps {
  onCreateTell?: () => void;
  onAuthClick?: () => void;
  onBrowseStories?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onCreateTell,
  onAuthClick,
  onBrowseStories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedCountry } = useLocation();
  const [tells, setTells] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [users, setUsers] = useState([]); // State to store user data

  // Function to get brand logo placeholder or actual logo
  const getBrandLogo = (brandName: string, logoUrl?: string | null) => {
    if (logoUrl) {
      return logoUrl;
    }

    // Generate a placeholder logo URL using a service like UI Avatars or similar
    const encodedName = encodeURIComponent(brandName);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=40&background=f59e0b&color=000&bold=true&format=png`;
  };

  // Filter brands based on search term
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch tells, brands, and users from Supabase
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch tells
        let tellsQuery = supabase
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
            brand_name,image_url,evidence_urls
          `
          )
          .order("created_at", { ascending: false })
          .limit(20);

        if (selectedCountry && selectedCountry !== "GLOBAL") {
          tellsQuery = tellsQuery.eq("country", selectedCountry);
        }

        const { data: tellsData, error: tellsError } = await tellsQuery;

        if (tellsError) throw tellsError;

        // 2. Fetch users data
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, full_name");

        if (usersError) throw usersError;

        // 3. Fetch brands data (assuming you have a brands table)
        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("id, name, logo_url, category");

        if (brandsError) {
          console.warn(
            "Brands table not found, creating brands from tells data"
          );
        }

        // Map user name to tells
        const tellsWithUser = (tellsData || []).map((tell) => {
          const user = (usersData || []).find((u) => u.id === tell.user_id);

          return {
            ...tell,
            user_name: user ? user.full_name : "Unknown User",
          };
        });

        // Create brand counts and brand list from tells
        const brandCounts: {
          [brandName: string]: {
            brandBlasts: number;
            brandBeats: number;
            total: number;
          };
        } = {};
        const uniqueBrandNames = new Set<string>();

        tellsWithUser.forEach((tell) => {
          const brandName = tell.brand_name;
          if (!brandName) return;

          uniqueBrandNames.add(brandName);

          if (!brandCounts[brandName]) {
            brandCounts[brandName] = {
              brandBlasts: 0,
              brandBeats: 0,
              total: 0,
            };
          }

          brandCounts[brandName].total += 1;

          if (tell.tell_type === "BrandBlast") {
            brandCounts[brandName].brandBlasts += 1;
          } else if (tell.tell_type === "BrandBeat") {
            brandCounts[brandName].brandBeats += 1;
          }
        });

        // Create brands array with counts
        const brandsWithCounts: Brand[] = Array.from(uniqueBrandNames)
          .map((brandName, index) => {
            const brandData = brandsData?.find(
              (b) => b.name.toLowerCase() === brandName.toLowerCase()
            );
            const counts = brandCounts[brandName];

            return {
              id: brandData?.id || `brand-${index}`,
              name: brandName,
              logo_url: brandData?.logo_url || null,
              tellsCount: counts.total,
              type:
                counts.brandBlasts > counts.brandBeats
                  ? "More BrandBlasts"
                  : counts.brandBeats > counts.brandBlasts
                  ? "More BrandBeats"
                  : "Mixed Reviews",
              category: brandData?.category || "General",
              brandblaststCount: counts.brandBlasts,
              brandbeatsCount: counts.brandBeats,
            };
          })
          .sort((a, b) => b.tellsCount - a.tellsCount); // Sort by tell count

        setBrands(brandsWithCounts);

        // Map counts to tells
        const tellsWithCounts = tellsWithUser.map((tell) => {
          const brandCountsForThisTell = brandCounts[tell.brand_name];

          return {
            ...tell,
            brandBlastsCount: brandCountsForThisTell?.brandBlasts || 0,
            brandBeatsCount: brandCountsForThisTell?.brandBeats || 0,
          };
        });

        setTells(tellsWithCounts);
      } catch (err) {
        console.error("Error fetching tells for homepage:", err);
        setTells([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry]);

  const handleLike = (tellId: string) => {
    console.log("Liked tell:", tellId);
    // In a real app, this would update the backend
  };

  const handleComment = (tellId: string, comment: string) => {
    console.log("Comment on tell:", tellId, comment);
    // In a real app, this would add the comment to the backend
  };

  return (
    <div className="min-h-screen">
      <AwardNotificationBanner />
      <DynamicHeroBanner
        onCreateTell={onCreateTell}
        onBrowseStories={onBrowseStories}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Recent Stories, Find Brands, and Trending Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Stories - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Recent Stories
                </h2>
                <p className="text-gray-600 max-w-2xl">
                  Discover the latest brand experiences shared by our community.
                  Real stories from real customers.
                </p>
              </div>

              {!tells || tells.length === 0 ? (
                <div className="text-center py-12 md:py-20 bg-gray-50 rounded-lg">
                  <MessageSquare className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                    No Stories Yet
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Be the first to share your brand experience and help others
                    make informed decisions!
                  </p>
                  <div className="space-y-4">
                    <Button
                      onClick={onCreateTell}
                      className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-6 py-3 text-lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Share Your First Story
                    </Button>
                    <p className="text-sm text-gray-500">
                      Help build the community by sharing your experiences
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Carousel Navigation - Above the cards */}
                  <div className="flex justify-between items-center mb-4">
                    <div></div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 h-8 w-8"
                        onClick={() => {
                          const carousel = document.querySelector(
                            '[data-carousel="recent-stories"]'
                          );
                          const prevButton = carousel?.querySelector(
                            "[data-carousel-prev]"
                          ) as HTMLButtonElement;
                          prevButton?.click();
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2 h-8 w-8"
                        onClick={() => {
                          const carousel = document.querySelector(
                            '[data-carousel="recent-stories"]'
                          );
                          const nextButton = carousel?.querySelector(
                            "[data-carousel-next]"
                          ) as HTMLButtonElement;
                          nextButton?.click();
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stories Container - 3 cards stacked vertically */}
                  <Carousel className="w-full" data-carousel="recent-stories">
                    <CarouselContent className="-ml-4">
                      {Array.from({
                        length: Math.ceil((tells || []).length / 3),
                      }).map((_, pageIndex) => (
                        <CarouselItem
                          key={pageIndex}
                          className="pl-4 basis-full"
                        >
                          <div className="space-y-4">
                            {(tells || [])
                              .slice(pageIndex * 3, pageIndex * 3 + 3)
                              .map((tell, index) => (
                                <TellCardWithUserPhoto
                                  key={tell.id}
                                  tell={{
                                    ...tell,
                                    content: tell.content,
                                    tell_type: tell.tell_type,
                                    user_name: tell.user_name,
                                    brand_name:
                                      tell.brand_name || "Unknown Brand",
                                    rating: Math.floor(Math.random() * 5) + 1, // Random rating for demo
                                    likes_count: Math.floor(Math.random() * 50),
                                    comments_count: Math.floor(
                                      Math.random() * 20
                                    ),
                                    category: "General", // Add a default category
                                  }}
                                  onClick={() =>
                                    console.log("Tell clicked:", tell.id)
                                  }
                                />
                              ))}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden" data-carousel-prev />
                    <CarouselNext className="hidden" data-carousel-next />
                  </Carousel>

                  {tells.length > 3 && (
                    <div className="text-center mt-6">
                      <Button
                        onClick={onBrowseStories}
                        variant="outline"
                        className="px-8 py-3"
                      >
                        View All Stories
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Takes 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Find Brands Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg md:text-xl">
                    <Search className="h-5 w-5 mr-2" />
                    Find Brands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search for a brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                  />
                  {brands.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h4 className="font-semibold text-gray-700 mb-2">
                        No Brands Yet
                      </h4>
                      <p className="text-sm mb-4">
                        Start sharing experiences to build the directory!
                      </p>
                      <Button
                        onClick={onCreateTell}
                        size="sm"
                        className="bg-yellow-400 text-black hover:bg-yellow-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Brand
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {/* Show only the first 5 brands */}
                      {filteredBrands.slice(0, 5).map((brand) => (
                        <Link
                          key={brand.id}
                            to={`/brand/${createSlug(brand.name)}`}
                          className="block p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {/* Set a fixed size for the brand logo */}
                              <BrandLogoFetcher
                                brandName={brand.name}
                                className="w-20 h-20 object-contain rounded-xl shadow-2xl bg-white/95 p-3" // Adjust size here
                              />
                              <div className="hidden w-10 h-10 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-yellow-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {brand.name}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center space-x-2">
                                <span>
                                  {brand.tellsCount}{" "}
                                  {brand.tellsCount === 1 ? "tell" : "tells"}
                                </span>
                                <span>•</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    brand.type === "More BrandBeats"
                                      ? "bg-green-100 text-green-700"
                                      : brand.type === "More BrandBlasts"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {brand.type}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {brand.brandblaststCount} BrandBlast •{" "}
                                {brand.brandbeatsCount} BrandBeat
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}

                      {/* Show "No Brands Found" if search term doesn't match any */}
                      {filteredBrands.length === 0 && searchTerm && (
                        <div className="text-center py-4 text-gray-500">
                          <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">
                            No brands found matching "{searchTerm}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* View All Brands Button */}
                  <div className="mt-4">
                    <Link to="/brands">
                      <Button variant="outline" className="w-full">
                        View All Brands ({brands.length})
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Brands Section */}
              <TrendingBrands />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
