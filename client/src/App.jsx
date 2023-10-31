import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Index from './pages/Index'
import Login from './pages/Login'
import ViewArticle from './pages/ViewArticle'
import Unauthorized from './pages/Unauthorized'
import RequireAuth from './components/RequireAuth'
import PersistLogin from './components/PersistLogin'
import Admin from './pages/Admins'
import Tags from './pages/Tags'
import CategoryArticles from './pages/CategoryArticles'
import Articles from './pages/Articles'
import CreateArticle from './pages/CreateArticle'
import NotFound from './pages/NotFound'


const ROLES = {
	"ADMIN": "admin",
	"USER": "user"
}


const App = () => {
  return (
	<Routes>
		<Route path='/' element={<Layout />}>
			{/* public routes */}
			<Route path='/' element={<Index />} />
			<Route path='/login' element={<Login/>} />
			<Route path='/article/:title' element={<ViewArticle />} />
			<Route path='/category/:name' element={<CategoryArticles />} />
			<Route path='/unauthorized' element={<Unauthorized />} />

			{/* private admin routes */}
			<Route element={<PersistLogin />}>
				<Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />} >
					<Route path='/admins' element={<Admin />} />
					<Route path='/tags' element={<Tags />} />
					<Route path='/articles' element={<Articles />} />
					<Route path='/article/create' element={<CreateArticle />} />
				</Route>
			</Route>

			{/* catch all */}
			<Route path='*' element={<NotFound />} />
		</Route>
	</Routes>
  )
}

export default App