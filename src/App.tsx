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
