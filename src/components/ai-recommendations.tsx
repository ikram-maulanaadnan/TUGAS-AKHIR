"use client";

import { useState, useEffect } from "react";
import { Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIRecommendation {
  id: number;
  reading_id: number;
  recommendation: string;
  risk_level: string;
  created_at: string;
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/ai-recommendations?limit=5");
        const data = await response.json();
        
        if (data.success) {
          setRecommendations(data.data);
        }
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
    // Refresh recommendations every 30 seconds
    const interval = setInterval(fetchRecommendations, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4" />;
      case "low":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="text-purple-600 text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            <p className="text-sm text-gray-500">Smart insights for your plants</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No recommendations available yet</p>
          <p className="text-sm">AI will analyze sensor data and provide recommendations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                      getRiskLevelColor(recommendation.risk_level)
                    }`}
                  >
                    {getRiskIcon(recommendation.risk_level)}
                    <span>{recommendation.risk_level || "Medium"} Risk</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(recommendation.created_at)}</span>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{recommendation.recommendation}</p>

              <div className="flex items-center space-x-3">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Implement
                </Button>
                <Button variant="outline" size="sm">
                  Ignore
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
