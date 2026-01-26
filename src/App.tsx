import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './components/layout/Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthLayout } from './components/layout/AuthLayout'
import OnboardingPage from './pages/auth/OnboardingPage'
import MainPage from './pages/MainPage'
import LoginPage from './pages/auth/LoginPage'
import WeekMissionPage from './pages/WeekMissionPage'
import TeamBoardPage from './pages/TeamBoardPage'
import SignupPage from './pages/auth/SignupPage'
import WorkStatusPage from './pages/WorkStatusPage'
import ProfileAnalysisPage from './pages/ProfileAnalysisPage'
import AnalysisLayout from './components/layout/AnalysisLayout'
import MyPage from './pages/MyPage'
import { ProfileSettings } from './components/mypage/profile-settings/ProfileSettings'
import IdeaAnalysis from './components/mypage/idea-analysis/IdeaAnalysis'

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
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <MainPage />,
			},
			{
				path: '/week-mission',
				element: <WeekMissionPage />,
			},
			{
				path: '/team-board',
				element: <TeamBoardPage />,
			},
			{
				path: '/work-status',
				element: <WorkStatusPage />,
			},
			{
				path: '/my-page',
				element: <MyPage />,
				children: [
					{
						index: true,
						element: <ProfileSettings />,
					},
					{
						path: 'profile',
						element: <ProfileSettings />,
					},
					{
						path: 'idea-analysis',
						element: <IdeaAnalysis />,
					},
				],
			},
		],
	},
	{
		element: <AnalysisLayout />,
		children: [
			{
				path: '/profile-analysis',
				element: <ProfileAnalysisPage />,
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
				path: '/onboarding',
				element: <OnboardingPage />,
			},
			{
				path: '/signup',
				element: <SignupPage />,
			},
		],
	},
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
