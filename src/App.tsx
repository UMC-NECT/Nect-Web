import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { MainLayout } from './components/layout/MainLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthLayout } from './components/layout/AuthLayout'
import OnboardingPage from './pages/auth/OnboardingPage'
import MainPage from './pages/MainPage'
import LoginPage from './pages/auth/LoginPage'
import AuthCallbackPage from './pages/auth/AuthCallbackPage'
import WeekMissionPage from './pages/WeekMissionPage'
import TeamBoardPage from './pages/TeamBoardPage'
import SignupPage from './pages/auth/SignupPage'
import WorkStatusPage from './pages/WorkStatusPage'
import ProfileAnalysisPage from './pages/ProfileAnalysisPage'
import AnalysisLayout from './components/layout/AnalysisLayout'
import MyPage from './pages/MyPage'
import { ProfileSettings } from './components/mypage/profile-settings/ProfileSettings'
import IdeaAnalysis from './components/mypage/idea-analysis/IdeaAnalysis'
import OngoingProject from './components/mypage/ongoing-project/OngoingProject'
import ProfileAnalysis from './components/mypage/profile-analysis/ProfileAnalysis'
import { MatchingStatus } from './components/mypage/matching-status/MatchingStatus'
import IdeaAnalyzePage from './pages/IdeaAnalyzePage'
import AnalyzeReportPage from './pages/AnalyzeReportPage'
import RecruitingProjectsPage from './pages/RecruitingProjectsPage'
import MatchingAvailablePage from './pages/MatchingAvailablePage'
import BoardPage from './pages/BoardPage'
import SharedDocumentsPage from './pages/SharedDocumentsPage'
import ProjectListPage from './pages/ProjectListPage'
import NecterListPage from './pages/NecterListPage'
import AllProjects from './components/mypage/all-projects/AllProjects'
import ErrorPage from './components/splash/ErrorPage'
import SplashLayout from './components/layout/SplashLayout'
import WorkspaceLayout from './components/layout/WorkSpaceLayout'
import MyPageLayout from './components/layout/MyPageLayout'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 3,
		},
	},
})

const router = createBrowserRouter([
	{
		element: <MainLayout />,
		children: [
			{
				path: '/',
				element: <MainPage />,
			},
			{
				path: '/recruiting-projects/:projectId',
				element: <RecruitingProjectsPage />,
			},
			{
				path: '/matching-available/:userId',
				element: <MatchingAvailablePage />
			},
			{
				path: '/projectList', // 모집 중인 프로젝트 전체
				element: <ProjectListPage />,
			},
			{
				path: '/necterList', // 지금 가능한 넥터 전체
				element: <NecterListPage />,
			},
		],
	},
	{
		element: <WorkspaceLayout />,
		children: [
			{
				path: '/week-mission',
				element: <WeekMissionPage />,
			},
			{
				path: '/team-board/:projectId?',
				element: <TeamBoardPage />,
			},
			{
				path: '/board/:projectId?',
				element: <BoardPage />,
			},
			{
				path: '/shared-documents/:projectId?',
				element: <SharedDocumentsPage />,
			},
			{
				path: '/work-status',
				element: <WorkStatusPage />,
			},
		],
	},
	{
		element: <AnalysisLayout />,
		children: [
			{
				path: '/profile-analyze',
				element: <ProfileAnalysisPage />,
			},
			{
				path: '/idea-analyze',
				element: <IdeaAnalyzePage />,
			},
			{
				path: '/analyze-report',
				element: <AnalyzeReportPage />,
			},
		],
	},
	{
		element: <AuthLayout />,
		children: [
			{
				path: '/login',
				element: <LoginPage />,
			},
			{
				path: '/auth/callback',
				element: <AuthCallbackPage />,
			},
			{
				path: '/onboarding',
				element: <OnboardingPage />,
			},
			{
				path: '/signup',
				element: <SignupPage />,
			},
		],
	},
	{
		element: <SplashLayout />,
		children: [
			{
				path: '/error/:code',
				element: <ErrorPage />,
			},
		],
	},
	{
		element: <MyPageLayout />,
		children: [
			{
				path: '/mypage',
				element: <MyPage />,
				children: [
					{
						index: true,
						element: <Navigate to='/mypage/profile' replace />,
					},
					{
						path: 'profile',
						element: <ProfileSettings />,
					},
					{
						path: 'idea-analysis',
						element: <IdeaAnalysis />,
					},
					{
						path: 'profile-analysis',
						element: <ProfileAnalysis />,
					},
					{
						path: 'projects',
						element: <AllProjects />,
					},
					{
						path: 'ongoing',
						element: <OngoingProject />,
					},
					{
						path: 'matching',
						element: <MatchingStatus />,
					},
				],
			},
		],
	}
])

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	)
}

export default App
