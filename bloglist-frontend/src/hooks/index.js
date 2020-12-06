import { useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const usePathMatch = (arr, path) => {
  const pathMatch = useRouteMatch(path)
  const matchedElement = pathMatch
    ? arr.find((o) => o.id === pathMatch.params.id)
    : null

  return matchedElement
}

export const useAppState = () => {
  const appState = useSelector((state) => state)

  const user = appState.user
  const users = appState.users
  const blogs = appState.blogs
  const notification = appState.notification
  const visible = appState.visible

  return { notification, blogs, user, visible, users }
}
