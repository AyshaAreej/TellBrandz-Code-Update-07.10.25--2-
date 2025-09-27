import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageSquare, TrendingUp } from "lucide-react";
import { BrandShowcaseSlide } from "./BrandShowcaseSlide";
import { supabase } from "@/lib/supabase";
import { CountrySelector } from "./CountrySelector";
import { useLocation } from "@/hooks/useLocation";

interface DynamicHeroBannerProps {
  onCreateTell?: () => void;
  onBrowseStories?: () => void;
}

interface FeaturedTell {
  id: string;
  tellTitle: string;
  tellSlug: string;
  type: "brand_blast" | "brand_beat";
  brandLogo: string;
  brandName: string;
  tellerPhoto: string;
  tellerFirstName: string;
  tellerLocation: string;
  brandBlastsCount: number;
  brandBeatsCount: number;
  commentsLink: string;
}

const LAST_TELL_STORAGE_KEY = "hero_last_tell_index";

const DynamicHeroBanner: React.FC<DynamicHeroBannerProps> = ({
  onCreateTell,
  onBrowseStories,
}) => {
  const { selectedCountry, updateSelectedCountry } = useLocation();
  const [currentState, setCurrentState] = useState(0); // 0 = State 1, 1 = State 2
  const [featuredTells, setFeaturedTells] = useState<FeaturedTell[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTellIndex, setCurrentTellIndex] = useState(0); // seed tell index
  const [state2TellPhase, setState2TellPhase] = useState(0); // 0 or 1 for State 2 alternation

  // Fetch data
  useEffect(() => {
    const fetchAllTells = async () => {
      try {
        setLoading(true);

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
            country,
            brand_id,
            brand_name
          `
          )
          .order("created_at", { ascending: false })
          .limit(20);

        if (selectedCountry && selectedCountry !== "GLOBAL") {
          tellsQuery = tellsQuery.eq("country", selectedCountry);
        }

        const { data: tellsData, error: tellsError } = await tellsQuery;

        if (tellsError) throw tellsError;

        const { data: brandsData, error: brandsError } = await supabase
          .from("brands")
          .select("id, name");

        if (brandsError) throw brandsError;

        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, full_name, avatar_url");

        if (usersError) throw usersError;

        const tellsWithBrandAndUser = (tellsData || []).map((tell) => {
          const brand = (brandsData || []).find((b) => b.id === tell.brand_id);
          const user = (usersData || []).find((u) => u.id === tell.user_id);
          return {
            ...tell,
            user_name: user ? user.full_name : "Unknown User",
            avatar_url: user ? user.avatar_url : null,
            brand_name: tell.brand_name ?? brand?.name ?? "Unknown Brand",
          };
        });

        const brandCounts: {
          [brandName: string]: { brandBlasts: number; brandBeats: number };
        } = {};

        tellsWithBrandAndUser.forEach((tell) => {
          const brandName = tell.brand_name;
          if (!brandCounts[brandName]) {
            brandCounts[brandName] = { brandBlasts: 0, brandBeats: 0 };
          }
          if (tell.tell_type === "BrandBlast") {
            brandCounts[brandName].brandBlasts += 1;
          } else if (tell.tell_type === "BrandBeat") {
            brandCounts[brandName].brandBeats += 1;
          }
        });

        const convertedTells: FeaturedTell[] = tellsWithBrandAndUser.map((tell) => {
          const slug = tell.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();

          const brandCountsForThisTell = brandCounts[tell.brand_name];

          return {
            id: tell.id,
            tellTitle: tell.title,
            tellSlug: slug,
            type: tell.tell_type === "BrandBlast" ? "brand_blast" : "brand_beat",
            brandLogo: "/placeholder.svg",
            brandName: tell.brand_name || "Unknown Brand",
            tellerPhoto:
              tell.avatar_url ||
              "https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757134664984_8ba0be21.png",
            tellerFirstName: (tell.user_name || "Anonymous").split(" ")[0],
            tellerLocation: tell.country || "Unknown Location",
            brandBlastsCount: brandCountsForThisTell
              ? brandCountsForThisTell.brandBlasts
              : 0,
            brandBeatsCount: brandCountsForThisTell
              ? brandCountsForThisTell.brandBeats
              : 0,
            commentsLink: `/tell/${slug}#comments`,
          };
        });

        setFeaturedTells(convertedTells);
      } catch (err) {
        console.error("Error fetching tells for hero banner:", err);
        setFeaturedTells([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTells();
  }, [selectedCountry]);

   // Restore last seen tell (start from THE SAME tell)
  useEffect(() => {
    if (!featuredTells.length) return;
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(LAST_TELL_STORAGE_KEY);
    const lastSeen = raw !== null ? parseInt(raw, 10) : NaN;

    if (!Number.isNaN(lastSeen)) {
      const startIndex = ((lastSeen % featuredTells.length) + featuredTells.length) % featuredTells.length;
      setCurrentTellIndex(startIndex);
      setState2TellPhase(0); // optional: reset phase so the exact tell is shown cleanly
    } else {
      setCurrentTellIndex(0);
    }
  }, [featuredTells.length]);

  // Clamp currentTellIndex if list length changes
  useEffect(() => {
    if (!featuredTells.length) return;
    setCurrentTellIndex((prev) => (prev % featuredTells.length + featuredTells.length) % featuredTells.length);
  }, [featuredTells.length]);

  // Main carousel timer (State 1 -> State 2: 6s, State 2 -> State 1 and advance tell: 8s)
  useEffect(() => {
    if (!featuredTells.length) return;

    const timer = setTimeout(() => {
      if (currentState === 0) {
        setCurrentState(1);
      } else {
        setCurrentState(0);
        setCurrentTellIndex((prev) => {
          const nextIndex = (prev + 2) % featuredTells.length; // your existing advance-by-2 rule
          return nextIndex;
        });
      }
    }, currentState === 0 ? 6000 : 8000);

    return () => clearTimeout(timer);
  }, [currentState, featuredTells.length]);

  // Brand cycling timer for State 2 - shows 2 tells alternating every 4 seconds
  useEffect(() => {
    if (currentState !== 1 || featuredTells.length <= 1) return;

    setState2TellPhase(0);

    const brandTimer = setInterval(() => {
      setState2TellPhase((prev) => (prev === 0 ? 1 : 0));
    }, 4000);

    return () => clearInterval(brandTimer);
  }, [currentState, currentTellIndex, featuredTells.length]);

  // Which tell is actually visible
  const getDisplayTellIndex = () => {
    if (!featuredTells.length) return 0;
    if (currentState === 1) {
      return (currentTellIndex + state2TellPhase) % featuredTells.length;
    }
    return currentTellIndex;
  };

  const displayTellIndex = getDisplayTellIndex();

  // Persist the actually visible tell index so we resume on THIS one next time
  useEffect(() => {
    if (!featuredTells.length) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LAST_TELL_STORAGE_KEY, String(displayTellIndex));
  }, [displayTellIndex, featuredTells.length]);

  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
  } as const;

  return (
    <div className="relative overflow-hidden">
      {/* Country Selector - Bottom Right Corner (optional) */}
      <div className="absolute bottom-6 right-6 z-30">
        <CountrySelector
          selectedCountry={selectedCountry}
          onCountryChange={updateSelectedCountry}
        />
      </div>

      {/* State 1: Original Banner */}
      {currentState === 0 && (
        <div
          className="relative py-20 bg-cover bg-center bg-no-repeat min-h-screen"
          style={backgroundStyle}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Digital Bureau for
              <br />
              <span className="text-yellow-400">Real Accountability</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-4xl mx-auto">
              Share your brand experiences, hold companies accountable, and help
              others make informed decisions. Your voice matters in building
              better business practices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = "/share-experience")}
                size="lg"
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-4 text-lg rounded-lg shadow-lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Share Your Experience
              </Button>
              <Button
                onClick={onBrowseStories}
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg rounded-lg group"
              >
                <TrendingUp className="h-5 w-5 mr-2 text-white group-hover:text-black" />
                Browse Brand Stories
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* State 2: Brand Showcase - Show real tells data */}
      {currentState === 1 && (
        <div
          className="relative py-20 bg-cover bg-center bg-no-repeat min-h-screen"
          style={backgroundStyle}
        >
          <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
            {loading ? (
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading featured stories...</p>
              </div>
            ) : featuredTells.length > 0 ? (
              <>
                <div className="text-center mb-4">
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-1">
                    Featured Brand <span className="text-yellow-400">Tells</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-white/80">
                    Discover what people are saying about top brands
                  </p>
                </div>
                <BrandShowcaseSlide {...featuredTells[displayTellIndex]} />
              </>
            ) : (
              <div className="text-center text-white">
                <div className="mb-8">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-white/50" />
                  <h3 className="text-3xl font-bold mb-4">No Stories Yet</h3>
                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                    Be the first to share your brand experience and help build
                    the community!
                  </p>
                  <Button
                    onClick={onCreateTell}
                    size="lg"
                    className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-4 text-lg rounded-lg"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Share Your First Story
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentState(currentState === 0 ? 1 : 0)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-20"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setCurrentState(currentState === 0 ? 1 : 0)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-20"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Indicators - Hidden on mobile */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 hidden sm:flex">
        {[0, 1].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentState(index)}
            className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
              currentState === index ? "bg-yellow-400" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DynamicHeroBanner;
