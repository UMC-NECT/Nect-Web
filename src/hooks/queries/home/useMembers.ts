import { useQuery } from '@tanstack/react-query';
import { getMatchableMembers, getRecommendationMembers } from '@/api/home';

export const useMatchableMembers = (count: number = 4) => {
  return useQuery({
    queryKey: ['home', 'matchable-members', count],
    queryFn: () => getMatchableMembers(count),
    select: (data) => data.body?.members || [],
  });
};

export const useRecommendationMembers = (count: number = 15) => {
  return useQuery({
    queryKey: ['home', 'recommendation-members', count],
    queryFn: () => getRecommendationMembers(count),
    select: (data) => data.body?.members || [],
  });
};