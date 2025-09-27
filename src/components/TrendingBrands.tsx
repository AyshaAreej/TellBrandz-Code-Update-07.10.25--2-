import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface TrendingTell {
  tell_id: string;
  brand_name: string;
  tell_type: string;
  created_at: string;
  likes: number;
  comments: number;
  engagement: number;
}

const TrendingBrands: React.FC = () => {
  const [trendingTells, setTrendingTells] = useState<TrendingTell[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    fetchTrendingTells();
  }, []);

  const fetchTrendingTells = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "trending-brands",
        {
          body: { timeframe: "7d", limit: 5 },
        }
      );

      if (error) throw error;

      if (data?.data?.trending_tells) {
        const mapped = data.data.trending_tells.map((t) => ({
          tell_id: t.tell_id,
          brand_name: t.brand_name,
          tell_type: t.tell_type,
          created_at: t.created_at,
          likes: t.likes,
          comments: t.comments,
          engagement: t.engagement,
        }));
        setTrendingTells(mapped);
      }
    } catch (error) {
      console.warn("Trending function failed, using demo data");
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trendingTells.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h4 className="font-semibold text-gray-700 mb-2">
              No Trending Tells Yet
            </h4>
            <p className="text-sm mb-4">
              Be the first to share experiences and create trending stories!
            </p>
            <div className="text-xs text-gray-400">
              Tells become trending based on likes and comments this week.
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {trendingTells.slice(0, 5).map((tell, index) => (
                <Link key={tell.tell_id} to={"/browse-stories"} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{tell.brand_name}</div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span className="flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {tell.tell_type}
                          </span>
                          {/* <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {new Date(tell.created_at).toLocaleDateString()}
                          </span> */}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      General
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Based on likes and comments this week.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingBrands;
