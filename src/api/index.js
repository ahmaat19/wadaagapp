import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import axiosApi from './axiosApi'

export default function apiHook({ key, method, url }) {
  const queryClient = new QueryClient()
  switch (method) {
    case 'POST':
      const post = useMutation((obj) => axiosApi(method, url, obj), {
        retry: 0,
        onSuccess: async () => await queryClient.invalidateQueries([key]),
      })
      return { post }

    case 'GET':
      const get = useQuery([key], (obj) => axiosApi(method, url, {}), {
        retry: 0,
      })
      return { get }

    case 'PUT':
      const update = useMutation((obj) => axiosApi(method, url, obj), {
        retry: 0,
        onSuccess: async () => await queryClient.invalidateQueries([key]),
      })
      return { update }

    case 'DELETE':
      const deleteObj = useMutation((obj) => axiosApi(method, url, obj), {
        retry: 0,
        onSuccess: async () => await queryClient.invalidateQueries([key]),
      })
      return { deleteObj }

    default:
      break
  }
}
