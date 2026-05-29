import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import RankingPage from '../pages/RankingPage'
import CanteenListPage from '../pages/CanteenListPage'
import CanteenDetailPage from '../pages/CanteenDetailPage'
import DishDetailPage from '../pages/DishDetailPage'
import ProfilePage from '../pages/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'canteens', element: <CanteenListPage /> },
      { path: 'canteens/:canteenId', element: <CanteenDetailPage /> },
      { path: 'dishes/:dishId', element: <DishDetailPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])
