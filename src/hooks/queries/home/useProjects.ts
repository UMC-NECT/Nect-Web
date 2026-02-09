import { useQuery } from '@tanstack/react-query';
import { getRecruitingProjects, getRecommendationProjects } from '@/api/home';

export const useRecruitingProjects = (count: number = 4) => {
  return useQuery({
    queryKey: ['home', 'recruiting-projects', count],
    queryFn: () => getRecruitingProjects(count),
    select: (data) => data.body?.projects || [],
  });
};

export const useRecommendationProjects = (count: number = 15) => {
  return useQuery({
    queryKey: ['home', 'recommendation-projects', count],
    queryFn: () => getRecommendationProjects(count),
    select: (data) => data.body?.projects || [],
  });
};