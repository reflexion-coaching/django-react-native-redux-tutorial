import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:8000/api/v1/' }), // 'https://pokeapi.co/api/v2/' or 'http://127.0.0.1:8000/api/v1/'
  endpoints: builder => ({
    getListOfBooks: builder.query({
      query: () => `books/`, // query: (name) => `pokemon/${name}` or query: () => `books/`
    }),
  }),
})

export const { useGetListOfBooksQuery } = bookApi
